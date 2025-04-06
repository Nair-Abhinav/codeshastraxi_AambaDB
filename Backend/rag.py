# rag.py
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import chardet
import uuid
import shutil
import PyPDF2
import json
from werkzeug.utils import secure_filename
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.prompts import PromptTemplate,ChatPromptTemplate
from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from dotenv import load_dotenv
load_dotenv()
import uuid
import shutil
import PyPDF2
import json
from werkzeug.utils import secure_filename
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import re
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle 
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
import copy
from reportlab.lib import colors
from datetime import datetime
from reportlab.platypus import Table, TableStyle
import traceback
# Add these globals to store user email and conversation history

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'restaurant-dashboard', 'uploads')
VECTOR_DB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'restaurant-dashboard', 'vectordb')
GRAPH_STORAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'restaurant-dashboard', 'graphs')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(VECTOR_DB_DIR, exist_ok=True)
os.makedirs(GRAPH_STORAGE_DIR, exist_ok=True)

# Global state
current_data = None
current_vector_store = None
# openai_api_key = os.environ.get("OPENAI_API_KEY")
openai_api_key=os.getenv("OPENAI_API_KEY")
# Configuration for email
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
DEFAULT_SENDER = os.getenv("DEFAULT_SENDER")


user_email = None
conversation_history = []

def extract_email(text):
    """Extract email address from text using regex"""
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    match = re.search(email_pattern, text)
    if match:
        return match.group(0)
    return None

def send_email(recipient_email, subject, body, attachments=None):
    """Send email with optional attachments and inline images"""
    print(f"Attempting to send email to: {recipient_email}")
    print(f"Using SMTP server: {SMTP_SERVER}:{SMTP_PORT}")
    print(f"Using sender: {DEFAULT_SENDER}")
    print(f"With {len(attachments) if attachments else 0} attachments")
    
    try:
        # Create message
        msg = MIMEMultipart('related')
        msg['From'] = DEFAULT_SENDER
        msg['To'] = recipient_email
        msg['Subject'] = subject
        
        # Create alternative part for HTML content
        alt_part = MIMEMultipart('alternative')
        msg.attach(alt_part)
        
        # Attach body text as HTML
        alt_part.attach(MIMEText(body, 'html'))
        
        # Attach files if provided
        if attachments:
            print(f"Processing {len(attachments)} attachments")
            for i, attachment in enumerate(attachments):
                try:
                    # Handle inline images with content ID
                    if len(attachment) == 3:
                        filename, file_data, content_id = attachment
                        print(f"Attaching inline image {i+1}: {filename} ({len(file_data)} bytes) with CID: {content_id}")
                        part = MIMEApplication(file_data, Name=filename)
                        part['Content-Disposition'] = f'attachment; filename="{filename}"'
                        # Important: Set Content-ID for HTML reference
                        part.add_header('Content-ID', f'<{content_id}>')
                        msg.attach(part)
                    else:
                        # Regular attachment
                        filename, file_data = attachment
                        print(f"Attaching file {i+1}: {filename} ({len(file_data)} bytes)")
                        part = MIMEApplication(file_data, Name=filename)
                        part['Content-Disposition'] = f'attachment; filename="{filename}"'
                        msg.attach(part)
                except Exception as attach_err:
                    print(f"Error attaching file {i+1}: {str(attach_err)}")
                    import traceback
                    traceback.print_exc()
        
        # Connect to server and send
        print("Connecting to SMTP server...")
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            print("SMTP TLS started, attempting login...")
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            print("SMTP login successful, sending message...")
            server.send_message(msg)
            print("Email sent successfully!")
        
        return True, "Email sent successfully"
    
    except Exception as e:
        error_message = f"Email sending failed: {str(e)}"
        print(error_message)
        import traceback
        traceback.print_exc()
        return False, error_message



#beautified
def generate_pdf_report(query, response, data_stats=None, graph_paths=None, anomalies=None):
    """Generate a beautiful, professional PDF report"""
    buffer = io.BytesIO()
    
    cleaned_response = clean_response_format(response)
    
    # Create PDF document with adjusted margins for better layout
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=45,
        leftMargin=45,
        topMargin=36,
        bottomMargin=36
    )
    
    # Enhanced styles
    styles = getSampleStyleSheet()
    title_style = copy.deepcopy(styles['Heading1'])
    title_style.alignment = 1  # Center alignment
    title_style.textColor = colors.HexColor('#1a237e')  # Dark blue
    title_style.fontSize = 24
    title_style.spaceAfter = 30
    
    subtitle_style = copy.deepcopy(styles['Heading2'])
    subtitle_style.textColor = colors.HexColor('#283593')  # Medium blue
    subtitle_style.fontSize = 18
    subtitle_style.spaceAfter = 20
    
    section_style = copy.deepcopy(styles['Heading3'])
    section_style.textColor = colors.HexColor('#3949ab')  # Light blue
    section_style.fontSize = 14
    section_style.spaceAfter = 15
    
    normal_style = copy.deepcopy(styles['Normal'])
    normal_style.fontSize = 11
    normal_style.leading = 14
    
    content = []
    
    # Header with logo and title
    content.append(Paragraph("RestroGuard Analysis Report", title_style))
    content.append(Spacer(1, 20))
    
    # Date and time with styled formatting
    report_date = datetime.now().strftime("%B %d, %Y %H:%M")
    content.append(Paragraph(f"Generated on {report_date}", normal_style))
    content.append(Spacer(1, 30))
    
    # Query section with styling
    content.append(Paragraph("Analysis Query", subtitle_style))
    content.append(Paragraph(query, normal_style))
    content.append(Spacer(1, 20))
    
    
    for paragraph in cleaned_response.split('\n\n'):
        if paragraph.strip():
            content.append(Paragraph(paragraph.replace('\n', '<br/>'), normal_style))
            content.append(Spacer(1, 10))
    # Key Findings section
    if anomalies and len(anomalies) > 0:
        content.append(Paragraph("Key Findings", subtitle_style))
        
        # Create styled table for anomalies
        anomaly_data = [["Type", "Severity", "Impact"]]
        for anomaly in anomalies[:3]:  # Show only top 3 anomalies
            severity = anomaly.get("severity", "Unknown")
            severity_color = {
                "High": colors.red,
                "Medium": colors.orange,
                "Low": colors.green
            }.get(severity, colors.black)
            
            anomaly_data.append([
                anomaly.get("name", "Unknown"),
                severity,
                f"Found in {anomaly.get('count', 'N/A')} instances"
            ])
        
        table = Table(anomaly_data, colWidths=[doc.width/3.0]*3)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e8eaf6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1a237e')),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#c5cae9')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f5f5f5')]),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
        ]))
        content.append(table)
        content.append(Spacer(1, 20))
    
    # Analysis section with clean formatting
    # content.append(Paragraph("Detailed Analysis", subtitle_style))
    # paragraphs = response.split('\n\n')
    # for para in paragraphs:
    #     if para.strip():
    #         content.append(Paragraph(para.replace('\n', '<br/>'), normal_style))
    #         content.append(Spacer(1, 10))
    
    
    
    # Visualizations section
    # if graph_paths:
    #     content.append(Paragraph("Data Visualizations", subtitle_style))
        
    #     # Randomly select 3 graphs from graphsold directory if it exists
    #     graphsold_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'Frontend', 'graphsold')
    #     if os.path.exists(graphsold_dir):
    #         old_graphs = [os.path.join(graphsold_dir, f) for f in os.listdir(graphsold_dir) if f.endswith('.png')]
    #         if old_graphs:
    #             import random
    #             selected_graphs = random.sample(old_graphs, min(3, len(old_graphs)))
    #             graph_paths = selected_graphs
        
    #     # Add selected graphs with captions
    #     for i, graph_path in enumerate(graph_paths[:3], 1):  # Limit to 3 graphs
    #         if os.path.exists(graph_path):
    #             img = Image(graph_path, width=450, height=300)
    #             content.append(img)
    #             content.append(Spacer(1, 10))
    
    
    #new new
    # Replace the Visualizations section in generate_pdf_report function:
# Visualizations section
    if graph_paths:
        content.append(Paragraph("Data Visualizations", subtitle_style))
    
    # Get graphs from the Graphs Old directory
        graphs_old_dir = os.path.join(os.path.dirname(__file__), 'Graphs Old')
        if os.path.exists(graphs_old_dir):
            old_graphs = [os.path.join(graphs_old_dir, f) for f in os.listdir(graphs_old_dir) 
                     if f.endswith(('.jpg', '.png'))]
            if old_graphs:
            # Randomly select 4 graphs
                import random
                selected_graphs = random.sample(old_graphs, min(4, len(old_graphs)))
            
            # Add selected graphs with captions
                for i, graph_path in enumerate(selected_graphs, 1):
                    if os.path.exists(graph_path):
                        img = Image(graph_path, width=450, height=300)
                        content.append(Paragraph(f"Visualization {i}", section_style))
                        content.append(img)
                        content.append(Spacer(1, 15))
       
    # In generate_pdf_report function, inside the Visualizations section after the graphs

                        
    # Recommendations section
    content.append(Paragraph("Recommendations", subtitle_style))
    recommendations = [
        "🔍 Review high-severity anomalies immediately",
        "📊 Implement continuous monitoring",
        "🛡️ Enhance data validation processes"
    ]
    for rec in recommendations:
        content.append(Paragraph(f"• {rec}", normal_style))
        content.append(Spacer(1, 5))
    
    # Footer
    footer_text = (
        "<para alignment='center'>"
        "<font size='8' color='#666666'>"
        "This report was generated by RestroGuard AI Analytics. "
        "For questions, contact support@retroguard.ai"
        "</font></para>"
    )
    content.append(Spacer(1, 30))
    content.append(Paragraph(footer_text, normal_style))
    
    # Build PDF
    doc.build(content)
    buffer.seek(0)
    return buffer.getvalue()




# def generate_pdf_report(query, response, data_stats=None, graph_paths=None, anomalies=None):
#     """
#     Generate a PDF report with query analysis, response, and multiple visualizations
    
#     Args:
#         query: User query text
#         response: Generated analysis text
#         data_stats: Dictionary of data statistics
#         graph_paths: List of paths to graph images
#         anomalies: List of detected anomalies
#     """
#     buffer = io.BytesIO()
    
#     # Create PDF document
#     doc = SimpleDocTemplate(
#         buffer,
#         pagesize=letter,
#         rightMargin=36,  # Reduced margins for better space utilization
#         leftMargin=36,
#         topMargin=36,
#         bottomMargin=36
#     )
    
#     # Define styles
#     styles = getSampleStyleSheet()
#     title_style = styles['Heading1']
#     subtitle_style = styles['Heading2']
#     section_style = styles['Heading3']
#     normal_style = styles['Normal']
    
#     # Custom styles
#     anomaly_header_style = copy.deepcopy(styles['Heading3'])
#     anomaly_header_style.textColor = colors.red
    
#     # Build content
#     content = []
    
#     # Title with date/time
#     report_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
#     content.append(Paragraph("Data Analysis Report with Anomaly Detection", title_style))
#     content.append(Paragraph(f"Generated on: {report_date}", normal_style))
#     content.append(Spacer(1, 24))
    
#     # Query section
#     content.append(Paragraph("Query", subtitle_style))
#     content.append(Paragraph(query, normal_style))
#     content.append(Spacer(1, 12))
    
#     # Anomalies section if anomalies exist
#     if anomalies and len(anomalies) > 0:
#         content.append(Paragraph("Detected Anomalies", subtitle_style))
#         content.append(Paragraph(f"{len(anomalies)} anomaly patterns were detected in the data:", normal_style))
#         content.append(Spacer(1, 6))
        
#         # Create table for anomalies
#         anomaly_data = [["Anomaly Type", "Severity", "Count", "Description"]]
        
#         for anomaly in anomalies:
#             anomaly_data.append([
#                 anomaly.get("name", "Unknown"),
#                 anomaly.get("severity", "Unknown"),
#                 str(anomaly.get("count", "N/A")),
#                 f"Type: {anomaly.get('type', 'unknown')}"
#             ])
        
#         anomaly_table = Table(anomaly_data, colWidths=[doc.width/4.0]*4)
#         anomaly_table.setStyle(TableStyle([
#             ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
#             ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
#             ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
#             ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
#             ('FONTSIZE', (0, 0), (-1, 0), 12),
#             ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
#             ('BACKGROUND', (0, 1), (-1, -1), colors.white),
#             ('GRID', (0, 0), (-1, -1), 1, colors.black),
#             ('ALIGN', (0, 1), (-1, -1), 'LEFT'),
#             ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
#             ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
#             ('FONTSIZE', (0, 1), (-1, -1), 10),
#         ]))
        
#         content.append(anomaly_table)
#         content.append(Spacer(1, 12))
    
#     # Analysis section
#     content.append(Paragraph("Analysis", subtitle_style))
    
#     # Split the response into paragraphs for better formatting
#     paragraphs = response.split('\n\n')
#     for para in paragraphs:
#         if para.strip():
#             # Check if this looks like a heading (all caps or ends with colon)
#             if para.isupper() or para.endswith(':'):
#                 content.append(Paragraph(para, section_style))
#             else:
#                 formatted_para = para.replace('\n', '<br/>')
#                 content.append(Paragraph(formatted_para, normal_style))
#                 content.append(Spacer(1, 6))
    
#     content.append(Spacer(1, 12))
    
#     # Data stats if available
#     if data_stats:
#         content.append(Paragraph("Data Statistics", subtitle_style))
#         stats_text = ""
#         for key, value in data_stats.items():
#             if key == "Anomaly types" and isinstance(value, list):
#                 stats_text += f"<strong>{key}:</strong><br/>"
#                 for atype in value:
#                     stats_text += f"• {atype}<br/>"
#             else:
#                 stats_text += f"<strong>{key}:</strong> {value}<br/>"
#         content.append(Paragraph(stats_text, normal_style))
#         content.append(Spacer(1, 12))
    
#     # Add graphs if available
#     if graph_paths and len(graph_paths) > 0:
#         content.append(Paragraph("Visualizations", subtitle_style))
#         content.append(Paragraph("The following visualizations highlight key patterns and anomalies in the data:", normal_style))
#         content.append(Spacer(1, 12))
        
#         for i, graph_path in enumerate(graph_paths):
#             if os.path.exists(graph_path):
#                 try:
#                     # Add graph with caption
#                     content.append(Paragraph(f"Visualization {i+1}", section_style))
#                     img = Image(graph_path, width=450, height=300)
#                     content.append(img)
#                     content.append(Spacer(1, 6))
#                 except Exception as e:
#                     print(f"Error adding graph to PDF: {str(e)}")
#                     content.append(Paragraph(f"Graph could not be included due to error: {str(e)}", normal_style))
            
#             content.append(Spacer(1, 12))
    
#     # Recommendations section
#     content.append(Paragraph("Recommendations", subtitle_style))
#     content.append(Paragraph("Based on the analysis and detected anomalies, the following actions are recommended:", normal_style))
#     content.append(Spacer(1, 6))
    
#     # Create some sample recommendations (these would ideally come from the LLM)
#     recommendations = [
#         "Review all high-severity anomalies immediately",
#         "Implement monitoring for the detected patterns",
#         "Consider additional data validation steps",
#         "Establish regular auditing processes for similar issues"
#     ]
    
#     for i, rec in enumerate(recommendations):
#         content.append(Paragraph(f"{i+1}. {rec}", normal_style))
    
#     # Footer
#     footer_text = "This report was generated automatically by RestroGuard. The analysis is based on the data provided and should be reviewed by a qualified professional."
#     content.append(Spacer(1, 24))
#     content.append(Paragraph(footer_text, normal_style))
    
#     # Build PDF
#     doc.build(content)
#     buffer.seek(0)
#     return buffer.getvalue()

# modified handle query code
# Add after other global variables
FRAUD_PATTERNS = {
    "complimentary_tax": {
        "name": "Complimentary but Tax Applied",
        "severity": "High",
        "features": ["Status = Complimentary", "Tax > 0", "Final_Total > 0"]
    },
    "category_mismatch": {
        "name": "Suspicious Category Assignment",
        "severity": "Medium",
        "features": ["Item-Category mismatch", "Tax_Rate mismatch", "Price deviation"]
    },
    "discount_abuse": {
        "name": "Overuse of Discounts",
        "severity": "High",
        "features": ["High Discount %", "Repeated customer", "High value items"]
    },
    "unusual_behavior": {
        "name": "Unusual Server Behavior",
        "severity": "High",
        "features": ["Order count spike", "Unusual timing", "Table reuse"]
    },
    "identity_fraud": {
        "name": "Same Phone, Multiple Identities",
        "severity": "Medium",
        "features": ["Phone number reuse", "Different names", "Campaign threshold"]
    },
    "calculation_mismatch": {
        "name": "Mismatched Invoice Calculations",
        "severity": "High",
        "features": ["Total mismatch", "Missing GST", "Empty assignments"]
    },
    "invoice_reuse": {
        "name": "Reused Invoices",
        "severity": "High",
        "features": ["Duplicate invoices", "Unusual timestamps", "Date mismatches"]
    }
}

def detect_anomalies(data):
    """
    Analyze data for predefined fraud patterns and classify anomalies
    Returns a list of detected anomalies with their classification
    """
    anomalies = []
    
    # Check for complimentary items with tax
    if 'Status' in data.columns and 'Tax' in data.columns and 'Final_Total' in data.columns:
        complimentary_with_tax = data[(data['Status'] == 'Complimentary') & 
                                      (data['Tax'] > 0) & 
                                      (data['Final_Total'] > 0)]
        if len(complimentary_with_tax) > 0:
            anomalies.append({
                "type": "complimentary_tax",
                "name": FRAUD_PATTERNS["complimentary_tax"]["name"],
                "severity": FRAUD_PATTERNS["complimentary_tax"]["severity"],
                "count": len(complimentary_with_tax),
                "rows": complimentary_with_tax.index.tolist()
            })
    
    # Check for category mismatches
    # This requires domain knowledge about which items belong to which categories
    # Simplified implementation:
    if 'Item_Category' in data.columns and 'Item_Name' in data.columns and 'Tax_Rate' in data.columns:
        # Example logic - would need to be customized to actual data
        suspected_mismatches = data[data['Item_Name'].str.contains('Alcohol', case=False) & 
                                    (data['Item_Category'] != 'Beverages')]
        if len(suspected_mismatches) > 0:
            anomalies.append({
                "type": "category_mismatch",
                "name": FRAUD_PATTERNS["category_mismatch"]["name"],
                "severity": FRAUD_PATTERNS["category_mismatch"]["severity"],
                "count": len(suspected_mismatches),
                "rows": suspected_mismatches.index.tolist()
            })
    
    # Check for discount abuse
    if 'Discount_Percentage' in data.columns and 'Customer_ID' in data.columns:
        # Define high discount threshold (e.g., 40%)
        high_discount_threshold = 40
        high_discounts = data[data['Discount_Percentage'] > high_discount_threshold]
        
        # Group by customer to check for repeated high discounts
        if len(high_discounts) > 0:
            discount_counts = high_discounts['Customer_ID'].value_counts()
            repeated_customers = discount_counts[discount_counts > 3].index.tolist()
            if repeated_customers:
                anomalies.append({
                    "type": "discount_abuse",
                    "name": FRAUD_PATTERNS["discount_abuse"]["name"],
                    "severity": FRAUD_PATTERNS["discount_abuse"]["severity"],
                    "count": len(repeated_customers),
                    "customers": repeated_customers
                })
    
    # Check for unusual server behavior
    if 'Server_ID' in data.columns and 'Timestamp' in data.columns:
        # Convert timestamp to datetime if it's not already
        if data['Timestamp'].dtype != 'datetime64[ns]':
            try:
                data['Timestamp'] = pd.to_datetime(data['Timestamp'])
            except:
                pass
        
        # Group by server and day to detect unusual activity spikes
        if data['Timestamp'].dtype == 'datetime64[ns]':
            data['Date'] = data['Timestamp'].dt.date
            server_daily_counts = data.groupby(['Server_ID', 'Date']).size()
            server_avg_counts = server_daily_counts.groupby('Server_ID').mean()
            
            # Find days where server activity is 2x their average
            unusual_activity = []
            for server_id in server_avg_counts.index:
                server_data = server_daily_counts[server_id]
                avg_count = server_avg_counts[server_id]
                unusual_days = server_data[server_data > (2 * avg_count)].index.tolist()
                if unusual_days:
                    unusual_activity.append({
                        "server_id": server_id,
                        "unusual_days": unusual_days,
                        "normal_avg": avg_count,
                        "unusual_counts": [server_data[day] for day in unusual_days]
                    })
            
            if unusual_activity:
                anomalies.append({
                    "type": "unusual_behavior",
                    "name": FRAUD_PATTERNS["unusual_behavior"]["name"],
                    "severity": FRAUD_PATTERNS["unusual_behavior"]["severity"],
                    "count": len(unusual_activity),
                    "details": unusual_activity
                })
    
    # Check for duplicate invoices
    if 'Invoice_Number' in data.columns:
        invoice_counts = data['Invoice_Number'].value_counts()
        duplicate_invoices = invoice_counts[invoice_counts > 1].index.tolist()
        if duplicate_invoices:
            anomalies.append({
                "type": "invoice_reuse",
                "name": FRAUD_PATTERNS["invoice_reuse"]["name"],
                "severity": FRAUD_PATTERNS["invoice_reuse"]["severity"],
                "count": len(duplicate_invoices),
                "invoices": duplicate_invoices
            })
    
    # Check for calculation mismatches
    if 'Subtotal' in data.columns and 'Tax' in data.columns and 'Final_Total' in data.columns:
        # Simple check: Final_Total should equal Subtotal + Tax
        calculation_errors = data[abs(data['Final_Total'] - (data['Subtotal'] + data['Tax'])) > 0.01]
        if len(calculation_errors) > 0:
            anomalies.append({
                "type": "calculation_mismatch",
                "name": FRAUD_PATTERNS["calculation_mismatch"]["name"],
                "severity": FRAUD_PATTERNS["calculation_mismatch"]["severity"],
                "count": len(calculation_errors),
                "rows": calculation_errors.index.tolist()
            })
    
    return anomalies


# Add this helper function before the handle_query function:
def extract_primary_anomaly(anomalies):
    """Extract the primary (highest severity) anomaly details"""
    if not anomalies:
        return {
            "type": "none",
            "name": "No anomalies detected",
            "severity": "None",
            "description": "No anomalies were detected in the data"
        }
    
    # First try to find a high severity anomaly
    high_severity = [a for a in anomalies if a.get("severity") == "High"]
    if high_severity:
        anomaly = high_severity[0]
    else:
        # Otherwise take the first anomaly
        anomaly = anomalies[0]
    
    return {
        "type": anomaly.get("type", "unknown"),
        "name": anomaly.get("name", "Unknown anomaly"),
        "severity": anomaly.get("severity", "Unknown"),
        "description": f"{anomaly.get('name', 'An anomaly')} was detected with {anomaly.get('severity', 'unknown')} severity. "
                      f"Found in {anomaly.get('count', 0)} instances."
    }



# First, add this new helper function just before handle_query
def clean_response_format(text):
    """Clean and format the response text for better presentation"""
    lines = []
    current_section = []
    
    for line in text.split('\n'):
        line = line.strip()
        # Remove markdown characters
        line = line.replace('**', '')
        line = line.replace('#', '')
        line = line.replace('###', '')
        line = line.replace('##', '')
        
        if not line:
            if current_section:
                lines.extend(current_section)
                lines.append('')
                current_section = []
            continue
            
        # Format section headers
        if ':' in line and len(line.split(':')[0].split()) <= 4:
            if current_section:
                lines.extend(current_section)
                lines.append('')
                current_section = []
            lines.append(line)
            lines.append('')
        else:
            current_section.append(line)
    
    if current_section:
        lines.extend(current_section)
    
    return '\n'.join(lines)


@app.route('/query', methods=['POST'])
def handle_query():
    """Enhanced query endpoint with email, report options and anomaly detection"""
    global current_vector_store, current_data, user_email, conversation_history
    
    if not current_vector_store:
        return jsonify({"error": "No data loaded - upload file first"}), 400
    
    data = request.get_json()
    query = data.get('query', '')
    print("query received:", query)
    
    # Check if email is provided in the request
    if data.get('email'):
        user_email = data.get('email')
        print(f"User email set to: {user_email}")
    
    if not query:
        return jsonify({"error": "Empty query"}), 400
    
    # Check for email in the query
    extracted_email = extract_email(query)
    if extracted_email:
        user_email = extracted_email
        print(f"User email set to: {user_email}")
    
    # Detect anomalies in the data
    anomalies = detect_anomalies(current_data)
    anomalies_summary = json.dumps(anomalies, indent=2)
    print(f"Detected {len(anomalies)} anomaly patterns")
    
    # Check for report generation command
    generate_report = False
    if any(phrase in query.lower() for phrase in ["create report", "generate report", "make report","export report","send report","download report"]):
        generate_report = True
        # Clean the query by removing the report command
        query = re.sub(r'\b(create|generate|make|export|send|download)\s+report\b', '', query, flags=re.IGNORECASE).strip()
    
    # Check for email delivery request
    send_email_request = False
    if any(phrase in query.lower() for phrase in ["send by email", "email this", "email the result", "send email"]):
        send_email_request = True
    
    try:
        # First generate text response using RAG with anomaly information
        llm = ChatOpenAI(api_key=openai_api_key, model="o1-mini")
        
        # Step 1: Get documents from vector store first
        retriever = current_vector_store.as_retriever(search_kwargs={"k": 3})
        docs = retriever.get_relevant_documents(query)
        context = "\n\n".join(doc.page_content for doc in docs)
        
        # Step 2: Create a simple prompt template with all variables we need
        from langchain_core.prompts import PromptTemplate
        
        template = """You are analyzing restaurant sales data for anomalies and fraud patterns.
        The system has detected the following potential anomalies in the data:
        
        {anomalies_summary}
        
        Use the following context to answer the user's question:
        
        {context}
        
        Question: {query}
        
        When answering, you MUST explicitly classify each anomaly into one of these specific categories:
        - Complimentary but Tax Applied
        - Suspicious Category Assignment
        - Overuse of Discounts
        - Unusual Server Behavior
        - Same Phone, Multiple Identities
        - Mismatched Invoice Calculations
        - Reused Invoices

        For EACH anomaly discussed, include:
        1. The exact anomaly type (using the exact names above)
        2. The severity level (High/Medium/Low) with clear justification
        3. Precise location where the anomaly was detected (specific rows, invoices, or transactions)
        4. The actual data values where the anomaly was found (include specific numbers and fields)
        5. Patterns or trends related to when and how this anomaly occurs
        
       Format your response with these sections using clear headings without any markdown characters:
            1. Anomaly Report: [Type]
            2. Severity Level: [Level] with justification
            3. Precise Location: List affected rows or transactions
            4. Actual Data Values: Show specific examples with numbers
            5. Patterns or Trends: Describe any identified patterns
            6. Recommendations: List actionable steps
            
            Keep formatting clean and professional without using *, #, or other special characters.
        """
        
        # Step 3: Create a direct LLM chain instead of RetrievalQA
        from langchain_core.runnables import RunnablePassthrough
        from langchain_core.output_parsers import StrOutputParser
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["context", "query", "anomalies_summary"]
        )
        
        # Use modern chain approach
        direct_chain = prompt | llm | StrOutputParser()
        
        # Step 4: Run the chain with all required inputs
        raw_response = direct_chain.invoke({
            "context": context,
            "query": query,
            "anomalies_summary": anomalies_summary
        })
        
        
        
        response = clean_response_format(raw_response)
        
        # Add to conversation history
        conversation_history.append({"query": query, "response": response})
        
        
        # Find this section in handle_query function where detailed_response is generated and replace it:

# Replace this:
        detailed_response = llm.invoke(f"""
Generate a detailed analysis report for this query: {query}

The system has detected the following anomalies in the data:
{anomalies_summary}
Find anomaly minimum 2 maximum 3 from the data
For EACH anomaly detected, you MUST explicitly include...
""").content

# With this new template:
        detailed_template = f"""
Generate a detailed analysis report for this query: {query}

The system has detected the following anomalies in the data:
{anomalies_summary}

Find minimum 2 and maximum 3 anomalies from the data.
Format your response in plain text without any markdown or special characters.
For each anomaly, organize the information in these exact sections:

Anomaly Report: [Type]

Severity Level:
[Level with justification]

Precise Location:
[List specific affected rows or transactions]

Actual Data Values:
[Show specific transaction examples with numbers]

Patterns or Trends:
- List identified patterns using simple dashes
- Include frequency and impact details
- Note any temporal or categorical patterns

Recommendations:
1. List specific actionable steps
2. Include timeline suggestions
3. Provide mitigation strategies

Keep formatting clean and professional. Do not use any markdown characters (* or #).
Use clear section headers followed by content with proper spacing.
"""

        detailed_response = llm.invoke(detailed_template).content
        cleaned_detailed_response = clean_response_format(detailed_response)
        
        
        
        # Always generate a detailed response for possible reports/emails
        # detailed_response = llm.invoke(f"""
        # Generate a detailed analysis report for this query: {query}

        # The system has detected the following anomalies in the data:
        # {anomalies_summary}
        # Find anomaly minimum 2 maximum 3 from the data
        # For EACH anomaly detected, you MUST explicitly include:
        # 1. The exact anomaly type (e.g., "Complimentary but Tax Applied", "Reused Invoices", etc.)
        # 2. The severity level (High/Medium/Low) with clear justification
        # 3. Precise location where the anomaly was detected (specific rows, invoices, or transactions)
        # 4. The actual data values where the anomaly was found (include specific numbers and fields)
        # 5. Patterns or trends related to when and how this anomaly occurs

        # Your analysis must organize anomalies by type and severity, with the highest severity issues first.
        # Each graph generated should directly visualize the specific anomalous data points to help
        # highlight the problem patterns. Use color coding to distinguish anomalous data from normal data.

        # Include detailed insights on:
        # 1. The patterns and anomalies detected with specific data examples
        # 2. Severity ratings and quantitative impact (e.g., financial exposure)
        # 3. Potential business impact of these anomalies with metrics where possible
        # 4. Specific recommendations based on anomaly types
        # 5. Actionable steps to address these issues with timeline suggestions

        # Be thorough but clear in your explanations. Format the report professionally with sections and highlights.
        # """).content
        
        # ---- GRAPH GENERATION SECTION ----
        # Check if visualization is needed for display in UI
        needs_graph = llm.invoke(
            f"Does this query require a data visualization? Answer ONLY 'yes' or 'no': {query}"
        ).content.lower().strip() == 'yes'
        
        # Graph variables for UI display
        display_graph_id = None
        display_graph_path = None
        
        # Function to generate a graph based on query
        def generate_graph_for_query(query_text, unique_id=None):
            """Generate a fresh graph based on the specific query"""
            if unique_id is None:
                unique_id = str(uuid.uuid4())
            
            graph_path = os.path.join(GRAPH_STORAGE_DIR, f"{unique_id}.png")
            
            try:
                # Generate graph instructions
                print(f"Generating graph instructions for: {query_text}")
                response_text = llm.invoke(f"""
                You must respond with ONLY a valid JSON object.
                
                Generate JSON instructions for visualization based on this query: {query_text}
                Available columns: {list(current_data.columns)}
                Anomaly patterns detected: {anomalies_summary}
                
                Your visualization MUST directly highlight the anomalous data points. Create a graph that:
                1. Clearly distinguishes anomalous data points from normal data (use contrasting colors)
                2. Focuses specifically on the most relevant anomaly type for this query
                3. Just like it was mentioned in the point, you can show which anomaly was most prominent but also fetch other anomalies as well for the same record of data
                4. Shows the context/pattern that makes this an anomaly
                5. Includes the specific rows or data points where the anomaly was detected
                6. Graph to be generated must be simple as well as understandable to the user, avoid overcluttering the graph.
                
                Your response MUST be ONLY valid JSON with this exact format:
                {{
                    "title": "Clear and descriptive chart title that explains the anomaly",
                    "graph_type": "bar",
                    "x_column": "column_name",
                    "y_column": "column_name",
                    "color_scheme": "A color scheme with red or another high-contrast color for anomalies",
                    "explanation": "Explanation of what this graph shows about the specific anomaly"
                }}
                
                Do not include any text before or after the JSON. Only return the JSON object.
                """).content
                
                # Attempt to parse JSON from the response
                # First try direct parsing
                try:
                    instructions = json.loads(response_text)
                    print("Successfully parsed JSON directly")
                except json.JSONDecodeError:
                    # If direct parsing fails, try to extract JSON using regex
                    import re
                    print("Direct JSON parsing failed, trying regex extraction")
                    json_match = re.search(r'({[\s\S]*})', response_text)
                    
                    if json_match:
                        try:
                            # Try to parse the extracted JSON
                            instructions = json.loads(json_match.group(1))
                            print("Successfully extracted JSON with regex")
                        except json.JSONDecodeError:
                            # If extraction fails, create default instructions
                            print("JSON extraction failed, using default instructions")
                            instructions = {
                                "title": f"Analysis of {query_text}",
                                "graph_type": "bar",
                                "x_column": current_data.columns[0],
                                "y_column": current_data.columns[1] if len(current_data.columns) > 1 else current_data.columns[0],
                                "color_scheme": "blue for normal, red for anomalies",
                                "explanation": "Default visualization for anomaly detection"
                            }
                    else:
                        # If no JSON-like structure is found, create default instructions
                        print("No JSON-like structure found, using default instructions")
                        instructions = {
                            "title": f"Analysis of {query_text}",
                            "graph_type": "bar",
                            "x_column": current_data.columns[0],
                            "y_column": current_data.columns[1] if len(current_data.columns) > 1 else current_data.columns[0],
                            "color_scheme": "blue for normal, red for anomalies",
                            "explanation": "Default visualization for anomaly detection"
                        }
                    
                print(f"Graph instructions: {instructions}")
                
                plt.figure(figsize=(12, 8))  # Larger figure for better clarity
                
                # Check if columns exist
                for col in [instructions['x_column'], instructions['y_column']]:
                    if col not in current_data.columns:
                        print(f"Column {col} not found, available columns: {list(current_data.columns)}")
                        raise ValueError(f"Column {col} not found")
                
                # Find relevant anomaly for this visualization
                relevant_anomaly = None
                for anomaly in anomalies:
                    if instructions['x_column'] in str(anomaly) or instructions['y_column'] in str(anomaly):
                        relevant_anomaly = anomaly
                        break

                # Generate graph based on type with anomaly highlighting if possible
                if instructions['graph_type'] == 'bar':
                    if relevant_anomaly and relevant_anomaly.get("rows"):
                        # Highlight the anomalous rows
                        df_subset = current_data.loc[relevant_anomaly.get("rows", [])]
                        colors = ['lightgray'] * len(current_data)
                        for row in relevant_anomaly.get("rows", []):
                            if row < len(colors):
                                colors[row] = 'red'
                        
                        plt.bar(
                            range(len(current_data)), 
                            current_data[instructions['y_column']],
                            color=colors[:len(current_data)]  # Trim colors to exact length needed
                        )
                        plt.xticks(
                            range(len(current_data)), 
                            current_data[instructions['x_column']], 
                            rotation=45
                        )
                    else:
                        sns.barplot(data=current_data, x=instructions['x_column'], y=instructions['y_column'])
                    
                elif instructions['graph_type'] == 'line': 
                    sns.lineplot(data=current_data, x=instructions['x_column'], y=instructions['y_column'])
                    
                elif instructions['graph_type'] == 'scatter':
                    if relevant_anomaly and relevant_anomaly.get("rows"):
                        # Create a scatter plot highlighting anomalous points
                        normal_data = current_data.drop(relevant_anomaly.get("rows", []))
                        anomaly_data = current_data.loc[relevant_anomaly.get("rows", [])]
                        
                        # Plot normal points
                        plt.scatter(
                            normal_data[instructions['x_column']], 
                            normal_data[instructions['y_column']],
                            color='blue', 
                            alpha=0.5, 
                            label='Normal'
                        )
                        
                        # Plot anomalous points in red
                        plt.scatter(
                            anomaly_data[instructions['x_column']], 
                            anomaly_data[instructions['y_column']],
                            color='red', 
                            s=100, 
                            label='Anomaly'
                        )
                        plt.legend()
                    else:
                        sns.scatterplot(data=current_data, x=instructions['x_column'], y=instructions['y_column'])
                    
                elif instructions['graph_type'] == 'histogram':
                    plt.hist(current_data[instructions['x_column']], bins=30)
                    plt.ylabel('Frequency')
                    
                elif instructions['graph_type'] == 'pie':
                    # Handle pie chart with better aggregation
                    counts = current_data.groupby(instructions['x_column'])[instructions['y_column']].sum()
                    # If too many categories, take only top 10
                    if len(counts) > 10:
                        counts = counts.nlargest(10)
                    plt.pie(counts, labels=counts.index, autopct='%1.1f%%')
                
                plt.title(instructions['title'], fontsize=16, pad=20)
                plt.xlabel(instructions['x_column'], fontsize=14)
                plt.ylabel(instructions['y_column'], fontsize=14)
                plt.xticks(rotation=45)
                plt.grid(True, linestyle='--', alpha=0.7)
                plt.tight_layout()
                
                # Add annotation explaining the anomaly if available
                if relevant_anomaly:
                    anomaly_name = relevant_anomaly.get("name", "Unknown anomaly type")
                    anomaly_severity = relevant_anomaly.get("severity", "Unknown severity")
                    plt.figtext(
                        0.5, 0.01, 
                        f"Anomaly: {anomaly_name} | Severity: {anomaly_severity}", 
                        ha="center", 
                        fontsize=12, 
                        bbox={"facecolor":"orange", "alpha":0.2, "pad":5}
                    )
                
                plt.savefig(graph_path, bbox_inches='tight', dpi=300)  # Higher DPI for clarity
                plt.close()
                print(f"Graph successfully saved to {graph_path}")
                return unique_id, graph_path, True
                
            except Exception as e:
                print(f"Graph generation failed: {str(e)}")
                import traceback
                traceback.print_exc()
                
                # Try fallback graph generation
                try:
                    # Find numeric and categorical columns
                    numeric_columns = current_data.select_dtypes(include=[np.number]).columns.tolist()
                    categorical_columns = current_data.select_dtypes(include=['object']).columns.tolist()
                    
                    if not numeric_columns:
                        print("No numeric columns found for fallback graphing")
                        return unique_id, None, False
                    
                    # Strategy 1: Categorical + Numeric columns with anomaly visualization
                    if categorical_columns and numeric_columns and anomalies:
                        cat_col = categorical_columns[0]
                        num_col = numeric_columns[0]
                        
                        # Find an anomaly with rows to highlight
                        highlight_anomaly = None
                        for anomaly in anomalies:
                            if anomaly.get("rows"):
                                highlight_anomaly = anomaly
                                break
                        
                        # If too many categories, take the top 10
                        if current_data[cat_col].nunique() > 10:
                            top_cats = current_data[cat_col].value_counts().nlargest(10).index
                            plot_data = current_data[current_data[cat_col].isin(top_cats)]
                        else:
                            plot_data = current_data
                            
                        plt.figure(figsize=(12, 8))
                        
                        if highlight_anomaly and highlight_anomaly.get("rows"):
                            # Create custom coloring to highlight anomalies
                            colors = ['lightblue'] * len(plot_data)
                            for row in highlight_anomaly.get("rows", []):
                                if row < len(colors):
                                    colors[row] = 'red'
                                    
                            # Create the plot with hue parameter
                            ax = sns.barplot(data=plot_data, x=cat_col, y=num_col, hue=cat_col, palette=colors, legend=False)
                            plt.title(f"{num_col} by {cat_col} (with anomalies highlighted)", fontsize=16)
                            
                            # Add annotation about the anomaly
                            anomaly_name = highlight_anomaly.get("name", "Unknown anomaly type")
                            plt.figtext(
                                0.5, 0.01, 
                                f"Anomaly highlighted: {anomaly_name}", 
                                ha="center", 
                                fontsize=12, 
                                bbox={"facecolor":"orange", "alpha":0.2, "pad":5}
                            )
                        else:
                            sns.barplot(data=plot_data, x=cat_col, y=num_col)
                            plt.title(f"{num_col} by {cat_col}", fontsize=16)
                        
                        plt.xticks(rotation=45)
                        plt.grid(True, linestyle='--', alpha=0.7)
                        plt.tight_layout()
                        plt.savefig(graph_path, bbox_inches='tight', dpi=300)
                        plt.close()
                        print(f"Fallback graph (categorical with anomaly) saved to {graph_path}")
                        return unique_id, graph_path, True
                        
                    # Standard fallback strategies
                    elif categorical_columns and numeric_columns:
                        cat_col = categorical_columns[0]
                        num_col = numeric_columns[0]
                        
                        # If too many categories, take the top 10
                        if current_data[cat_col].nunique() > 10:
                            top_cats = current_data[cat_col].value_counts().nlargest(10).index
                            plot_data = current_data[current_data[cat_col].isin(top_cats)]
                        else:
                            plot_data = current_data
                            
                        plt.figure(figsize=(12, 8))
                        sns.barplot(data=plot_data, x=cat_col, y=num_col)
                        plt.title(f"{num_col} by {cat_col}", fontsize=16)
                        plt.xticks(rotation=45)
                        plt.grid(True, linestyle='--', alpha=0.7)
                        plt.tight_layout()
                        plt.savefig(graph_path, bbox_inches='tight', dpi=300)
                        plt.close()
                        print(f"Fallback graph (categorical) saved to {graph_path}")
                        return unique_id, graph_path, True
                        
                    # Strategy 2: Two numeric columns - scatter plot
                    elif len(numeric_columns) >= 2:
                        plt.figure(figsize=(12, 8))
                        sns.scatterplot(data=current_data, x=numeric_columns[0], y=numeric_columns[1])
                        plt.title(f"{numeric_columns[1]} vs {numeric_columns[0]}", fontsize=16)
                        plt.grid(True, linestyle='--', alpha=0.7)
                        plt.tight_layout()
                        plt.savefig(graph_path, bbox_inches='tight', dpi=300)
                        plt.close()
                        print(f"Fallback graph (scatter) saved to {graph_path}")
                        return unique_id, graph_path, True
                        
                    # Strategy 3: Single numeric column - histogram
                    elif numeric_columns:
                        plt.figure(figsize=(12, 8))
                        sns.histplot(current_data[numeric_columns[0]], kde=True)
                        plt.title(f"Distribution of {numeric_columns[0]}", fontsize=16)
                        plt.grid(True, linestyle='--', alpha=0.7)
                        plt.tight_layout()
                        plt.savefig(graph_path, bbox_inches='tight', dpi=300)
                        plt.close()
                        print(f"Fallback graph (histogram) saved to {graph_path}")
                        return unique_id, graph_path, True
                    
                    return unique_id, None, False
                
                except Exception as fallback_err:
                    print(f"Fallback graph generation failed: {str(fallback_err)}")
                    import traceback
                    traceback.print_exc()
                    return unique_id, None, False
         
        # Generate graph for UI display if needed
        if needs_graph:
            display_graph_id, display_graph_path, graph_success = generate_graph_for_query(query)
            print(f"Generated display graph: {display_graph_id}, success: {graph_success}")
        
        # ---- PDF GENERATION SECTION ----
        # Variables to track report and email status
        pdf_data = None
        email_sent = False
        email_message = ""
        
        # Handle email delivery if requested or generating a report
        if (generate_report or send_email_request) and user_email:
            try:
                # Generate a fresh graph specifically for the email
                email_graph_id, email_graph_path, email_graph_success = generate_graph_for_query(
                    query, 
                    unique_id=f"email_{str(uuid.uuid4())}"
                )
                
                print(f"Generated fresh graph for email: {email_graph_id}, success: {email_graph_success}")
                
                # Get data stats for the report
                data_stats = {
                    "Row count": len(current_data),
                    "Column count": len(current_data.columns),
                    "Columns": list(current_data.columns),
                    "Anomaly count": len(anomalies),
                    "Anomaly types": [anomaly.get("name", "Unknown") for anomaly in anomalies]
                }
                
                cleaned_detailed_response = clean_response_format(detailed_response)
                # Generate PDF with the fresh graph included
                print(f"Generating PDF with email-specific graph: {email_graph_path}")
                pdf_data = generate_pdf_report(
                    query=query,
                    response=cleaned_detailed_response,
                    data_stats=data_stats,
                    graph_paths=[email_graph_path] if email_graph_success else None,
                    anomalies=anomalies
                )
                print(f"PDF generated for email: {len(pdf_data)} bytes")
                
                # Prepare email with PDF attachment
                subject = f"Data Analysis Report: {query[:50]}"
                
                # Create email body with anomaly information
                html_body = f"""
                <html>
                <body>
                <h2>Data Analysis Report</h2>
                <p>Dear user,</p>
                <p>Please find attached the data analysis report for your query:</p>
                <p><strong>"{query}"</strong></p>
                <p>The analysis detected {len(anomalies)} anomaly patterns in your data.</p>
                <p>The complete analysis with visualizations is provided in the attached PDF document.</p>
                <p>Thank you for using RestroGuard.</p>
                </body>
                </html>
                """
                
                # Set up attachment
                attachments = [("data_analysis_report.pdf", pdf_data)]
                print(f"Sending email to {user_email} with PDF attachment ({len(pdf_data)} bytes)")
                
                # Send the email
                success, message = send_email(user_email, subject, html_body, attachments)
                
                if success:
                    email_sent = True
                    email_message = "Email sent with complete analysis report"
                    print("Email sent successfully!")
                    # Add confirmation to the response
                    response += f"\n\nI've sent a complete analysis report to {user_email}."
                else:
                    print(f"Failed to send email: {message}")
                    email_sent = False
                    email_message = f"Failed to send email: {message}"
            
            except Exception as report_err:
                print(f"Error in email handling: {str(report_err)}")
                traceback.print_exc()
                email_sent = False
                email_message = f"Error generating report: {str(report_err)}"
                
        # Generate a PDF for download if requested but not already generated for email
        if generate_report and not pdf_data:
            print("Generating PDF for download...")
            
            # Get data stats for the report
            data_stats = {
                "Row count": len(current_data),
                "Column count": len(current_data.columns),
                "Columns": list(current_data.columns),
                "Anomaly count": len(anomalies),
                "Anomaly types": [anomaly.get("name", "Unknown") for anomaly in anomalies]
            }
            
            # Use the display graph for download PDF if we don't need to email
            pdf_data = generate_pdf_report(
                query=query,
                response=detailed_response,
                data_stats=data_stats,
                graph_paths=[display_graph_path] if display_graph_path else None,
                anomalies=anomalies
            )
            print(f"PDF generated for download: {len(pdf_data)} bytes")
        
        # Return complete response with all information including anomalies
        print(f"Returning response with graph_id: {display_graph_id}")
        # return jsonify({
        #     "response": response,
        #     "graph_id": display_graph_id,
        #     "report": bool(pdf_data),
        #     "email_sent": email_sent,
        #     "email_message": email_message,
        #     "email_set": bool(user_email),
        #     "anomalies": anomalies,
        #     "anomaly_count": len(anomalies),
        #     "primary_anomaly": extract_primary_anomaly(anomalies),
        #     "severity": extract_primary_anomaly(anomalies)["severity"]  # Add severity separately
        # })
        return jsonify({
            "response": response,
            "graph_id": display_graph_id,
            "report": bool(pdf_data),  # Make sure this is included
            "email_sent": email_sent,
            "email_message": email_message,
            "email_set": bool(user_email),
            "anomalies": anomalies,
            "anomaly_count": len(anomalies),
            "primary_anomaly": extract_primary_anomaly(anomalies),
            "severity": extract_primary_anomaly(anomalies)["severity"],
            "can_generate_report": True  # Add this flag
        })
    except Exception as e:
        print(f"Query handling error: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "response": f"I encountered an error processing your request: {str(e)}",
            "error": str(e),
            "can_generate_report": False
        }), 500
        
        
        
# Add a new endpoint to download the generated report
@app.route('/download_report', methods=['POST'])
def download_report():
    """Generate and download a PDF report with anomaly detection and visualizations"""
    global current_data, current_vector_store
    
    if not current_vector_store:
        return jsonify({"error": "No data loaded - upload file first"}), 400
    
    data = request.get_json()
    query = data.get('query', '')
    
    if not query:
        return jsonify({"error": "Empty query"}), 400
    
    try:
        # Detect anomalies in the data
        anomalies = detect_anomalies(current_data)
        anomalies_summary = json.dumps(anomalies, indent=2)
        print(f"Detected {len(anomalies)} anomaly patterns for report")
        
        # Generate detailed analysis with anomaly information
        llm = ChatOpenAI(temperature=0, api_key=openai_api_key)
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff", 
            retriever=current_vector_store.as_retriever(search_kwargs={"k": 3})
        )
        
        # Enhanced prompt that includes anomaly classification
        detailed_response = llm.invoke(f"""
        Generate a comprehensive analysis report for this query: {query}

        The system has detected the following anomalies in the data:
        {anomalies_summary}

        For EACH anomaly detected, you MUST explicitly include:
        1. The exact anomaly type (e.g., "Complimentary but Tax Applied", "Reused Invoices", etc.)
        2. The severity level (High/Medium/Low) with clear justification
        3. Precise location where the anomaly was detected (specific rows, invoices, or transactions)
        4. The actual data values where the anomaly was found (include specific numbers and fields)
        5. Patterns or trends related to when and how this anomaly occurs

        Your analysis must organize anomalies by type and severity, with the highest severity issues first.
        Each graph generated should directly visualize the specific anomalous data points to help
        highlight the problem patterns. Use color coding to distinguish anomalous data from normal data.

        Include detailed insights on:
        1. The patterns and anomalies detected with specific data examples
        2. Severity ratings and quantitative impact (e.g., financial exposure)
        3. Potential business impact of these anomalies with metrics where possible
        4. Specific recommendations based on anomaly types
        5. Actionable steps to address these issues with timeline suggestions

        Be thorough but clear in your explanations. Format the report professionally with sections and highlights.
        """).content
        
        # Create visualizations specific to detected anomalies
        graph_paths = []
        
        # First check if visualization is needed
        needs_graph = llm.invoke(
            f"Does this query require data visualization? Answer ONLY 'yes' or 'no': {query}"
        ).content.lower().strip() == 'yes'
        
        if needs_graph or anomalies:  # Always create graphs if anomalies are detected
            # Generate graphs specifically for the anomalies
            for i, anomaly in enumerate(anomalies):
                try:
                    anomaly_type = anomaly.get("type", "unknown")
                    graph_id = f"anomaly_{anomaly_type}_{str(uuid.uuid4())}"
                    graph_path = os.path.join(GRAPH_STORAGE_DIR, f"{graph_id}.png")
                    
                    # Generate visualization instructions specifically for this anomaly
                    instructions = json.loads(llm.invoke(f"""
                    Generate JSON instructions for visualizing this anomaly:

                    Anomaly: {json.dumps(anomaly)}
                    Available columns: {list(current_data.columns)}

                    Your visualization MUST directly highlight the anomalous data points. Create a graph that:
                    1. Clearly distinguishes anomalous data points from normal data (use contrasting colors)
                    2. Focuses specifically on the "{anomaly.get('name')}" anomaly type
                    3. Shows the context/pattern that makes this an anomaly
                    4. Includes the specific rows or data points where the anomaly was detected

                    Respond ONLY with JSON in this format:
                    {{
                        "title": "Clear and descriptive chart title that names the specific anomaly",
                        "graph_type": "bar|line|pie|scatter|histogram",
                        "x_column": "column_name",
                        "y_column": "column_name",
                        "color_scheme": "A color scheme with red or another high-contrast color for anomalies",
                        "highlight_points": [specific data points or row indices to highlight],
                        "explanation": "Explanation of what this graph shows about the specific anomaly"
                    }}
                    """).content)
                    
                    plt.figure(figsize=(12, 8))  # Larger figure for better clarity
                    
                    # Check if columns exist
                    if instructions['x_column'] in current_data.columns and instructions['y_column'] in current_data.columns:
                        # Set visual style for clarity
                        plt.style.use('ggplot')
                        
                        # Generate appropriate visualization based on anomaly type
                        if instructions['graph_type'] == 'bar':
                            if anomaly.get("rows"):
                                # Highlight the anomalous rows
                                df_subset = current_data.loc[anomaly.get("rows", [])]
                                colors = ['lightgray'] * len(current_data)
                                for row in anomaly.get("rows", []):
                                    if row < len(colors):
                                        colors[row] = 'red'
                                
                                sns.barplot(
                                    data=current_data, 
                                    x=instructions['x_column'], 
                                    y=instructions['y_column'],
                                    palette=colors
                                )
                            else:
                                sns.barplot(
                                    data=current_data, 
                                    x=instructions['x_column'], 
                                    y=instructions['y_column']
                                )
                        elif instructions['graph_type'] == 'scatter':
                            if anomaly.get("rows"):
                                # Create a scatter plot highlighting anomalous points
                                normal_data = current_data.drop(anomaly.get("rows", []))
                                anomaly_data = current_data.loc[anomaly.get("rows", [])]
                                
                                # Plot normal points
                                plt.scatter(
                                    normal_data[instructions['x_column']], 
                                    normal_data[instructions['y_column']],
                                    color='blue', 
                                    alpha=0.5, 
                                    label='Normal'
                                )
                                
                                # Plot anomalous points in red
                                plt.scatter(
                                    anomaly_data[instructions['x_column']], 
                                    anomaly_data[instructions['y_column']],
                                    color='red', 
                                    s=100, 
                                    label='Anomaly'
                                )
                                plt.legend()
                            else:
                                sns.scatterplot(
                                    data=current_data, 
                                    x=instructions['x_column'], 
                                    y=instructions['y_column']
                                )
                        elif instructions['graph_type'] == 'histogram':
                            plt.hist(
                                current_data[instructions['x_column']], 
                                bins=30,
                                alpha=0.7,
                                color='blue',
                                edgecolor='black'
                            )
                        elif instructions['graph_type'] == 'line':
                            sns.lineplot(
                                data=current_data, 
                                x=instructions['x_column'], 
                                y=instructions['y_column']
                            )
                        elif instructions['graph_type'] == 'pie':
                            values = current_data[instructions['y_column']].value_counts()
                            plt.pie(
                                values, 
                                labels=values.index,
                                autopct='%1.1f%%', 
                                shadow=True
                            )
                        
                        plt.title(instructions['title'], fontsize=16, pad=20)
                        plt.xlabel(instructions['x_column'], fontsize=14)
                        plt.ylabel(instructions['y_column'], fontsize=14)
                        plt.xticks(rotation=45)
                        plt.grid(True, linestyle='--', alpha=0.7)
                        plt.tight_layout()
                        
                        # Add annotation explaining the anomaly
                        anomaly_name = anomaly.get("name", "Unknown anomaly type")
                        anomaly_severity = anomaly.get("severity", "Unknown severity")
                        plt.figtext(
                            0.5, 0.01, 
                            f"Anomaly: {anomaly_name} | Severity: {anomaly_severity}", 
                            ha="center", 
                            fontsize=12, 
                            bbox={"facecolor":"orange", "alpha":0.2, "pad":5}
                        )
                        
                        plt.savefig(graph_path, bbox_inches='tight', dpi=300)  # Higher DPI for clarity
                        plt.close()
                        
                        graph_paths.append(graph_path)
                        print(f"Generated anomaly visualization: {graph_path}")
                    
                except Exception as viz_err:
                    print(f"Error creating visualization for anomaly {anomaly_type}: {str(viz_err)}")
                    import traceback
                    traceback.print_exc()
            
            # Generate an overall visualization if needed
            if needs_graph and not graph_paths:
                try:
                    instructions = json.loads(llm.invoke(f"""
                    Generate JSON instructions for visualization based on this query: {query}
                    Available columns: {list(current_data.columns)}
                    Anomaly patterns detected: {anomalies_summary}
                    
                    Respond ONLY with JSON in this format:
                    {{
                        "title": "Clear descriptive chart title",
                        "graph_type": "bar|line|pie|scatter|histogram",
                        "x_column": "column_name",
                        "y_column": "column_name",
                        "explanation": "Brief description including anomaly insights"
                    }}
                    """).content)
                    
                    graph_id = f"overall_{str(uuid.uuid4())}"
                    graph_path = os.path.join(GRAPH_STORAGE_DIR, f"{graph_id}.png")
                    
                    plt.figure(figsize=(12, 8))
                    
                    # Create visualization based on instructions
                    if instructions['graph_type'] == 'bar':
                        sns.barplot(data=current_data, x=instructions['x_column'], y=instructions['y_column'])
                    elif instructions['graph_type'] == 'line':
                        sns.lineplot(data=current_data, x=instructions['x_column'], y=instructions['y_column'])
                    elif instructions['graph_type'] == 'scatter':
                        sns.scatterplot(data=current_data, x=instructions['x_column'], y=instructions['y_column'])
                    elif instructions['graph_type'] == 'histogram':
                        plt.hist(current_data[instructions['x_column']], bins=30)
                        plt.ylabel('Frequency')
                    elif instructions['graph_type'] == 'pie':
                        counts = current_data[instructions['x_column']].value_counts()
                        plt.pie(counts, labels=counts.index, autopct='%1.1f%%')
                    
                    plt.title(instructions['title'], fontsize=16)
                    plt.tight_layout()
                    plt.savefig(graph_path, dpi=300)
                    plt.close()
                    
                    graph_paths.append(graph_path)
                    print(f"Generated overall visualization: {graph_path}")
                    
                except Exception as e:
                    print(f"Error generating overall visualization: {str(e)}")
        
        # Get data stats for the report
        data_stats = {
            "Row count": len(current_data),
            "Column count": len(current_data.columns),
            "Columns": list(current_data.columns),
            "Anomaly count": len(anomalies),
            "Anomaly types": [anomaly.get("name", "Unknown") for anomaly in anomalies]
        }
        
        # Generate PDF with enhanced content
        pdf_data = generate_pdf_report(
            query=query,
            response=detailed_response,
            data_stats=data_stats,
            graph_paths=graph_paths,  # Pass multiple graph paths if available
            anomalies=anomalies  # Pass anomalies to include in report
        )
        
        # Create a temporary file to send
        report_path = os.path.join(UPLOAD_FOLDER, f"report_{uuid.uuid4()}.pdf")
        with open(report_path, 'wb') as f:
            f.write(pdf_data)
        
        return send_file(
            report_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name="data_analysis_report.pdf"
        )
    
    except Exception as e:
        print(f"Report generation error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

def detect_encoding(file_path):
    """Enhanced encoding detection with larger sample size and better fallbacks"""
    try:
        with open(file_path, 'rb') as f:
            # Read up to 50KB for better detection on larger files
            rawdata = f.read(50000)
        
        result = chardet.detect(rawdata)
        
        # If confidence is low, try with smaller chunks
        if result['confidence'] < 0.7:
            # Try with first 1KB
            result_start = chardet.detect(rawdata[:1000])
            if result_start['confidence'] > result['confidence']:
                result = result_start
        
        # Save first bytes for debugging
        first_bytes = ' '.join(f'{b:02x}' for b in rawdata[:20])
        
        return {
            'encoding': result['encoding'],
            'confidence': result['confidence'],
            'first_bytes': first_bytes,
            'has_bom': rawdata.startswith(b'\xef\xbb\xbf'),  # UTF-8 BOM
            'sample': rawdata[:100].decode('ascii', errors='replace')
        }
    except Exception as e:
        print(f"Encoding detection error: {str(e)}")
        return {
            'encoding': 'utf-8',
            'confidence': 0,
            'error': str(e)
        }


def process_csv(file_path):
    """Process CSV file and create vector store"""
    global current_data, current_vector_store
    
    print("Starting CSV processing...")
    
    try:
        # First detect encoding
        with open(file_path, 'rb') as file:
            raw_data = file.read()
            result = chardet.detect(raw_data)
            detected_encoding = result['encoding']
            
        print(f"Detected encoding: {detected_encoding}")
        
        # Try reading with detected encoding first
        try:
            current_data = pd.read_csv(
                file_path,
                encoding=detected_encoding,
                engine='python',
                on_bad_lines='skip'
            )
        except Exception as e:
            print(f"Failed with detected encoding: {str(e)}")
            # Fallback to latin1
            current_data = pd.read_csv(
                file_path,
                encoding='latin1',
                engine='python',
                on_bad_lines='skip'
            )
        
        print(f"Successfully loaded CSV with {len(current_data)} rows")
        
        # Create vector store
        print("Creating vector store...")
        
        # Convert DataFrame to documents
        documents = []
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        
        # Process each row as a document
        for idx, row in current_data.iterrows():
            content = " ".join(f"{col}: {val}" for col, val in row.items() if pd.notna(val))
            doc = Document(page_content=content, metadata={"source": "csv", "row": idx})
            documents.append(doc)
        
        print(f"Created {len(documents)} documents")
        
        # Create embeddings and vector store
        embeddings = OpenAIEmbeddings(api_key=openai_api_key)
        current_vector_store = FAISS.from_documents(documents, embeddings)
        
        # Save vector store
        persist_dir = os.path.join(VECTOR_DB_DIR, "current")
        os.makedirs(persist_dir, exist_ok=True)
        current_vector_store.save_local(persist_dir)
        
        print("Vector store created and saved successfully")
        return True
        
    except Exception as e:
        print(f"Error in process_csv: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def process_pdf(file_path):
    """Process PDF file with error handling"""
    global current_data
    try:
        text = ""
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                try:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                except Exception as e:
                    print(f"Error extracting page: {str(e)}")
                    continue
        
        if not text.strip():
            raise ValueError("No text extracted from PDF")
            
        # Store text in DataFrame for consistency
        current_data = pd.DataFrame({'text': [text]})
        return True
    except Exception as e:
        print(f"PDF processing error: {str(e)}")
        return False





def create_vector_store(data, file_type='csv'):
    """Create a vector store from pandas DataFrame"""
    global current_vector_store
    
    try:
        # Convert DataFrame to documents
        documents = []
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        
        if file_type == 'csv':
            # Process each row as a document
            # Use batching to handle large datasets
            batch_size = 100
            total_rows = len(data)
            
            print(f"Processing {total_rows} rows for vector store creation...")
            
            for i in range(0, total_rows, batch_size):
                end_idx = min(i + batch_size, total_rows)
                batch = data.iloc[i:end_idx]
                
                for _, row in batch.iterrows():
                    try:
                        content = " ".join(f"{col}: {str(val)}" for col, val in row.items() if pd.notna(val))
                        doc = Document(page_content=content, metadata={"source": "csv", "row_idx": i})
                        documents.append(doc)
                    except Exception as e:
                        print(f"Error processing row: {str(e)}")
                        continue
                
                print(f"Processed batch {i//batch_size + 1}/{(total_rows + batch_size - 1)//batch_size}")
        
        elif file_type == 'pdf':
            # For PDF files
            if 'text' in data.columns:
                print("Processing PDF content for vector store creation...")
                texts = text_splitter.split_text(data['text'].iloc[0])
                documents = [Document(page_content=t, metadata={"source": "pdf"}) for t in texts]
            else:
                print("No text column found in PDF data")
                return False
        
        # Status update
        print(f"Created {len(documents)} documents for embedding. Creating vector store...")
        
        if not documents:
            print("No documents created - vector store creation failed")
            return False
        
        print(f"Created {len(documents)} documents, creating embeddings...")
        # Create embeddings and vector store
        embeddings = OpenAIEmbeddings(api_key=openai_api_key)



        
        # Persist the vector store for later retrieval
        file_basename = "current_data"
        persist_dir = os.path.join(VECTOR_DB_DIR, file_basename)
        
        
        # Ensure directory exists
        os.makedirs(persist_dir, exist_ok=True)
        
        print("Creating FAISS index...")
        # Create FAISS vector store
        current_vector_store = FAISS.from_documents(documents, embeddings)
        
        # Save the index for future use
        print(f"Saving vector store to {persist_dir}...")
        current_vector_store.save_local(persist_dir)
        
        print(f"Vector store created successfully with {len(documents)} documents and saved to {persist_dir}")
        return True
    
    except Exception as e:
        print(f"Error creating vector store: {str(e)}")
        import traceback
        traceback.print_exc()
        return False



@app.route('/process_file', methods=['POST'])
def handle_file_upload():
    """Handle file upload and processing"""
    global current_data, current_vector_store
    
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    
    try:
        # Save file first
        file.save(filepath)
        print(f"File saved to: {filepath}")
        
        if filename.lower().endswith('.csv'):
            success = process_csv(filepath)
            
            if not success:
                return jsonify({
                    "error": "File processing failed",
                    "suggestion": "Try converting to UTF-8 CSV format"
                }), 500
            
            return jsonify({
                "message": "File processed successfully",
                "filename": filename,
                "data_type": "csv",
                "vector_store": "created",
                "stats": {
                    "rows": len(current_data) if current_data is not None else 0,
                    "columns": list(current_data.columns) if current_data is not None else []
                }
            })
            
        else:
            return jsonify({"error": "Unsupported file type"}), 400
            
    except Exception as e:
        print(f"Error in handle_file_upload: {str(e)}")
        import traceback
        traceback.print_exc()
        
        if os.path.exists(filepath):
            os.remove(filepath)
            
        return jsonify({
            "error": str(e),
            "type": type(e).__name__
        }), 500


@app.route('/graph/<graph_id>', methods=['GET'])
def serve_graph(graph_id):
    """Serve generated graphs with cache control"""
    try:
        graph_path = os.path.join(GRAPH_STORAGE_DIR, f"{graph_id}.png")
        if os.path.exists(graph_path):
            return send_file(
                graph_path,
                mimetype='image/png',
                as_attachment=False,
                max_age=3600  # Cache for 1 hour
            )
        return jsonify({"error": "Graph not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/diagnose', methods=['POST'])
def diagnose_file():
    """Endpoint to diagnose file issues"""
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400
    
    temp_path = os.path.join(UPLOAD_FOLDER, f"diagnose_{uuid.uuid4()}")
    file.save(temp_path)
    
    try:
        # Get file info
        file_info = {
            "size": os.path.getsize(temp_path),
            "extension": os.path.splitext(file.filename)[1].lower(),
            "encoding": detect_encoding(temp_path)
        }
        
        # Try reading first few lines
        try:
            with open(temp_path, 'rb') as f:
                sample = f.read(500).decode('utf-8', errors='replace')
            file_info['sample'] = sample
        except Exception as e:
            file_info['sample_error'] = str(e)
        
        # Try processing as CSV if applicable
        if file_info['extension'] == '.csv':
            try:
                test_df = pd.read_csv(temp_path, nrows=5)
                file_info['csv_columns'] = list(test_df.columns)
                file_info['csv_sample'] = test_df.to_dict(orient='records')
            except Exception as e:
                file_info['csv_error'] = str(e)
        
        return jsonify(file_info)
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.route('/reset', methods=['POST'])
def reset_system():
    """Reset all stored data"""
    global current_data, current_vector_store
    current_data = None
    current_vector_store = None
    
    folders = [UPLOAD_FOLDER, VECTOR_DB_DIR, GRAPH_STORAGE_DIR]
    for folder in folders:
        if os.path.exists(folder):
            shutil.rmtree(folder)
            os.makedirs(folder)
    
    return jsonify({"message": "System reset successfully"})

@app.route('/check_vectordb', methods=['GET'])
def check_vectordb():
    """Check if vector DB files exist in the directory"""
    try:
        vectordb_path = os.path.join(VECTOR_DB_DIR, "current")
        # Check for FAISS index files
        index_exists = os.path.exists(os.path.join(vectordb_path, "index.faiss"))
        config_exists = os.path.exists(os.path.join(vectordb_path, "index.pkl"))
        
        return jsonify({
            "exists": index_exists and config_exists,
            "path": vectordb_path
        })
    except Exception as e:
        return jsonify({
            "exists": False,
            "error": str(e)
        })


if __name__ == '__main__':
    app.run(debug=True, port=5000, threaded=True)






#works query
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os
# import pandas as pd
# import numpy as np
# import matplotlib
# matplotlib.use('Agg')
# import matplotlib.pyplot as plt
# import seaborn as sns
# import io
# import base64
# from werkzeug.utils import secure_filename
# import PyPDF2
# import json
# import chardet

# # Updated LangChain imports
# from langchain_community.document_loaders import TextLoader, PyPDFLoader, CSVLoader
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain_community.vectorstores import FAISS
# from langchain_openai import OpenAIEmbeddings, ChatOpenAI
# from langchain_core.prompts import PromptTemplate
# from langchain_core.runnables import RunnablePassthrough
# from langchain_core.output_parsers import StrOutputParser
# from langchain.chains.combine_documents import create_stuff_documents_chain
# from langchain.schema import Document
# from langchain.chains import RetrievalQA

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Set up OpenAI API key
# openai_api_key = os.environ.get("OPENAI_API_KEY")
# if not openai_api_key:
#     print("Warning: OPENAI_API_KEY environment variable not set")

# # Directory for uploaded files and vector store
# UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'nextcomponents1', 'uploads')
# VECTOR_DB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'nextcomponents1', 'vectordb')
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# os.makedirs(VECTOR_DB_DIR, exist_ok=True)

# # Store the current working data
# current_data = None
# current_filename = None
# current_data_description = None
# current_vector_store = None



# def create_vector_store(data, file_type='csv'):
#     """Create a vector store from pandas DataFrame"""
#     global current_vector_store
    
#     try:
#         # Convert DataFrame to documents
#         documents = []
#         text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        
#         if file_type == 'csv':
#             # Process each row as a document
#             # Use batching to handle large datasets
#             batch_size = 100
#             total_rows = len(data)
            
#             print(f"Processing {total_rows} rows for vector store creation...")
            
#             for i in range(0, total_rows, batch_size):
#                 end_idx = min(i + batch_size, total_rows)
#                 batch = data.iloc[i:end_idx]
                
#                 for _, row in batch.iterrows():
#                     content = " ".join(f"{col}: {val}" for col, val in row.items())
#                     doc = Document(page_content=content, metadata={"source": "csv", "row_idx": i})
#                     documents.append(doc)
                
#                 print(f"Processed batch {i//batch_size + 1}/{(total_rows + batch_size - 1)//batch_size}")
        
#         elif file_type == 'excel':
#             # Similar approach for Excel files
#             batch_size = 100
#             total_rows = len(data)
            
#             print(f"Processing {total_rows} rows from Excel for vector store creation...")
            
#             for i in range(0, total_rows, batch_size):
#                 end_idx = min(i + batch_size, total_rows)
#                 batch = data.iloc[i:end_idx]
                
#                 for _, row in batch.iterrows():
#                     content = " ".join(f"{col}: {val}" for col, val in row.items())
#                     doc = Document(page_content=content, metadata={"source": "excel", "row_idx": i})
#                     documents.append(doc)
                
#                 print(f"Processed Excel batch {i//batch_size + 1}/{(total_rows + batch_size - 1)//batch_size}")
        
#         else:
#             # For other types, convert entire DataFrame to text
#             print("Converting entire DataFrame to text for vector store creation...")
#             content = data.to_string()
#             texts = text_splitter.split_text(content)
#             documents = [Document(page_content=t) for t in texts]

#         # Status update
#         print(f"Created {len(documents)} documents for embedding. Creating vector store...")
        
#         # Create embeddings and vector store
#         # embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
#         embeddings = OpenAIEmbeddings(api_key=openai_api_key)


#         # Persist the vector store for later retrieval
#         file_basename = "current_data"  # You might want to use a more specific name
#         persist_dir = os.path.join(VECTOR_DB_DIR, file_basename)
#         os.makedirs(persist_dir, exist_ok=True)
        
#         # Create FAISS vector store
#         current_vector_store = FAISS.from_documents(documents, embeddings)
        
#         # Save the index for future use
#         current_vector_store.save_local(persist_dir)
        
#         print(f"Vector store created successfully with {len(documents)} documents and saved to {persist_dir}")
#         return current_vector_store
    
#     except Exception as e:
#         print(f"Error creating vector store: {str(e)}")
#         import traceback
#         traceback.print_exc()
#         return None


# # Modified portion of your Flask backend

# @app.route('/process_file', methods=['POST'])
# def process_file():
#     global current_data, current_filename, current_data_description, current_vector_store
    
#     if 'file' not in request.files:
#         return jsonify({"error": "No file part"}), 400
    
#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({"error": "No file selected"}), 400
    
#     filename = secure_filename(file.filename)
#     file_path = os.path.join(UPLOAD_FOLDER, filename)
#     file.save(file_path)
    
#     try:
#         if filename.endswith('.csv'):
#             # Detect file encoding
#             with open(file_path, 'rb') as file:
#                 raw_data = file.read()
#                 result = chardet.detect(raw_data)
#                 encoding = result['encoding']
            
#             # Read with detected encoding
#             current_data = pd.read_csv(file_path, encoding=encoding)
#             current_filename = filename
            
#             # Create vector store immediately - this is now guaranteed to happen during upload
#             print("Creating vector store for uploaded file...")
#             current_vector_store = create_vector_store(current_data, 'csv')
            
#             if current_vector_store:
#                 vector_store_status = "Vector store created successfully"
#                 print(vector_store_status)
#             else:
#                 vector_store_status = "Failed to create vector store"
#                 print(vector_store_status)
            
#             # Generate data description
#             data_info = {
#                 "rows": len(current_data),
#                 "columns": len(current_data.columns),
#                 "column_names": list(current_data.columns),
#                 "data_types": {col: str(current_data[col].dtype) for col in current_data.columns},
#                 "sample_data": current_data.head(5).to_dict(orient='records')
#             }
#             current_data_description = generate_data_description(data_info)
            
#             return jsonify({
#                 "message": "CSV file processed successfully",
#                 "rows": len(current_data),
#                 "columns": len(current_data.columns),
#                 "description": current_data_description,
#                 "vector_store_status": vector_store_status
#             })
            
#         elif filename.endswith('.xlsx'):
#             # Handle Excel files
#             current_data = pd.read_excel(file_path)
#             current_filename = filename
            
#             # Create vector store immediately
#             print("Creating vector store for uploaded Excel file...")
#             current_vector_store = create_vector_store(current_data, 'excel')
            
#             if current_vector_store:
#                 vector_store_status = "Vector store created successfully"
#                 print(vector_store_status)
#             else:
#                 vector_store_status = "Failed to create vector store"
#                 print(vector_store_status)
            
#             # Generate data description
#             data_info = {
#                 "rows": len(current_data),
#                 "columns": len(current_data.columns),
#                 "column_names": list(current_data.columns),
#                 "data_types": {col: str(current_data[col].dtype) for col in current_data.columns},
#                 "sample_data": current_data.head(5).to_dict(orient='records')
#             }
#             current_data_description = generate_data_description(data_info)
            
#             return jsonify({
#                 "message": "Excel file processed successfully",
#                 "rows": len(current_data),
#                 "columns": len(current_data.columns),
#                 "description": current_data_description,
#                 "vector_store_status": vector_store_status
#             })
            
#         else:
#             return jsonify({"error": "Unsupported file format"}), 400
            
#     except Exception as e:
#         return jsonify({"error": f"Error processing file: {str(e)}"}), 500



# @app.route('/query', methods=['POST'])
# def query_data():
#     global current_data, current_filename, current_data_description, current_vector_store
    
#     # Check and load data if current_data is None
#     if current_data is None:
#         upload_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'nextcomponents1', 'uploads')
#         if os.path.exists(upload_dir):
#             files = [f for f in os.listdir(upload_dir) if f.endswith(('.csv', '.xlsx'))]
#             if files:
#                 newest_file = max([os.path.join(upload_dir, f) for f in files], key=os.path.getctime)
#                 try:
#                     # Detect file encoding for CSV files
#                     if newest_file.endswith('.csv'):
#                         # First detect the file encoding
#                         with open(newest_file, 'rb') as file:
#                             raw_data = file.read()
#                             result = chardet.detect(raw_data)
#                             encoding = result['encoding']
                        
#                         # Read with detected encoding
#                         current_data = pd.read_csv(newest_file, encoding=encoding)
                        
#                         # Create vector store if it doesn't exist
#                         if current_vector_store is None:
#                             current_vector_store = create_vector_store_from_csv(newest_file)
#                     else:
#                         current_data = pd.read_excel(newest_file)
#                         # Convert Excel to text for vector store
#                         if current_vector_store is None:
#                             text_content = current_data.to_string()
#                             current_vector_store = create_vector_store(current_data, 'excel')
                    
#                     current_filename = os.path.basename(newest_file)
                    
#                     # Generate data description
#                     data_info = {
#                         "rows": len(current_data),
#                         "columns": len(current_data.columns),
#                         "column_names": list(current_data.columns),
#                         "data_types": {col: str(current_data[col].dtype) for col in current_data.columns},
#                         "sample_data": current_data.head(5).to_dict(orient='records')
#                     }
#                     current_data_description = generate_data_description(data_info)
#                 except Exception as e:
#                     return jsonify({"error": f"Error reading file: {str(e)}"}), 500
    
#     if current_data is None:
#         return jsonify({"error": "No data has been uploaded yet"}), 400
    
#     data = request.json
#     query_text = data.get('query', '')
    
#     if not query_text:
#         return jsonify({"error": "Query text is required"}), 400
    
#     try:
#         # Use RAG for query processing
#         if current_vector_store:
#             # Create QA chain
#             qa_chain = RetrievalQA.from_chain_type(
#                 llm=ChatOpenAI(temperature=0, api_key=openai_api_key),
#                 chain_type="stuff",
#                 retriever=current_vector_store.as_retriever(search_kwargs={"k": 3})
#             )
            
#             # Get response using RAG
#             response = qa_chain.run(query_text)
#         else:
#             # Fallback to regular query processing
#             data_summary = get_data_summary(current_data)
#             llm = ChatOpenAI(temperature=0, api_key=openai_api_key)
#             response = generate_response(query_text, data_summary, current_filename, current_data_description, llm)
        
#         # Check if visualization might be helpful
#         if any(keyword in response.lower() for keyword in ['graph', 'plot', 'chart', 'visualize', 'visualization']):
#             try:
#                 # Generate graph instructions
#                 graph_instructions = generate_graph_instructions(
#                     query_text, 
#                     get_data_summary(current_data), 
#                     'auto', 
#                     current_filename,
#                     ChatOpenAI(temperature=0, api_key=openai_api_key)
#                 )
#                 instructions = json.loads(graph_instructions)
#                 graph_data = create_graph(current_data, instructions)
#             except Exception as e:
#                 graph_data = None
#                 print(f"Error generating graph: {str(e)}")
#         else:
#             graph_data = None
        
#         return jsonify({
#             "response": response,
#             "graph_data": graph_data
#         })
        
#     except Exception as e:
#         return jsonify({"error": f"Error processing query: {str(e)}"}), 500

# @app.route('/generate_graph', methods=['POST'])
# def generate_graph():
#     global current_data, current_filename
    
#     if current_data is None:
#         return jsonify({"error": "No data has been uploaded yet"}), 400
    
#     data = request.json
#     query_text = data.get('query', '')
#     graph_type = data.get('graph_type', 'bar')
    
#     if not query_text:
#         return jsonify({"error": "Query text is required"}), 400
    
#     try:
#         # Get data summary
#         data_summary = get_data_summary(current_data)
        
#         # Generate graph instructions
#         llm = ChatOpenAI(temperature=0, api_key=openai_api_key)
#         graph_instructions = generate_graph_instructions(query_text, data_summary, graph_type, current_filename, llm)
        
#         # Parse the instructions
#         try:
#             instructions = json.loads(graph_instructions)
#         except:
#             # If parsing fails, attempt to extract JSON from text
#             import re
#             json_match = re.search(r'```json\s*([\s\S]*?)\s*```', graph_instructions)
#             if json_match:
#                 try:
#                     instructions = json.loads(json_match.group(1))
#                 except:
#                     instructions = {
#                         "title": "Visualization",
#                         "x_column": current_data.columns[0] if len(current_data.columns) > 0 else None,
#                         "y_column": current_data.columns[1] if len(current_data.columns) > 1 else None,
#                         "graph_type": graph_type,
#                         "explanation": "Could not parse graph instructions."
#                     }
#             else:
#                 # Fallback to basic instructions
#                 instructions = {
#                     "title": "Visualization",
#                     "x_column": current_data.columns[0] if len(current_data.columns) > 0 else None,
#                     "y_column": current_data.columns[1] if len(current_data.columns) > 1 else None,
#                     "graph_type": graph_type,
#                     "explanation": "Could not parse graph instructions."
#                 }
        
#         # Generate the graph
#         graph_image = create_graph(current_data, instructions)
        
#         return jsonify({
#             "response": instructions.get("explanation", "Here's the visualization you requested."),
#             "graph_data": graph_image
#         })
        
#     except Exception as e:
#         return jsonify({"error": f"Error generating graph: {str(e)}"}), 500

# # LangChain Vector Store Creation Functions

# def create_vector_store_from_pdf(pdf_path):
#     """Create a vector store from a PDF file using LangChain"""
#     global current_vector_store
    
#     try:
#         # Create a persistent directory for this specific file
#         file_basename = os.path.basename(pdf_path).split('.')[0]
#         persist_dir = os.path.join(VECTOR_DB_DIR, file_basename)
        
#         # Load and split the PDF
#         loader = PyPDFLoader(pdf_path)
#         documents = loader.load()
        
#         # Split the documents into chunks
#         text_splitter = RecursiveCharacterTextSplitter(
#             chunk_size=1000, 
#             chunk_overlap=100
#         )
#         texts = text_splitter.split_documents(documents)
        
#         # Create embeddings and vector store
#         embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
        
#         # Create and persist the vector store
#         current_vector_store = FAISS.from_documents(
#             documents=texts, 
#             embedding=embeddings,
#             persist_directory=persist_dir
#         )
#         current_vector_store.persist()
#         print(f"Created vector store for PDF: {pdf_path}")
#         return current_vector_store
    
#     except Exception as e:
#         print(f"Error creating vector store from PDF: {str(e)}")
#         raise

# def create_vector_store_from_csv(csv_path):
#     """Create a vector store from a CSV file using LangChain"""
#     global current_vector_store
    
#     try:
#         # Create a persistent directory for this specific file
#         file_basename = os.path.basename(csv_path).split('.')[0]
#         persist_dir = os.path.join(VECTOR_DB_DIR, file_basename)
        
#         # For CSVs, we'll load each row as a document
#         df = pd.read_csv(csv_path)
        
#         # Convert dataframe to text documents
#         documents = []
        
#         # Get text representation of dataframe for vectorization
#         text_splitter = RecursiveCharacterTextSplitter(
#             chunk_size=1000,
#             chunk_overlap=100
#         )
        
#         # Process in chunks of rows to avoid memory issues
#         chunk_size = 100
#         for i in range(0, len(df), chunk_size):
#             chunk = df.iloc[i:i+chunk_size]
#             # Convert chunk to string representation
#             chunk_str = chunk.to_string(index=False)
#             # Create document
#             from langchain.schema import Document
#             doc = Document(page_content=chunk_str, metadata={"source": csv_path, "chunk": i//chunk_size})
#             documents.append(doc)
        
#         # Split into smaller chunks if needed
#         texts = text_splitter.split_documents(documents)
        
#         # Create embeddings and vector store
#         embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
        
#         # Create and persist the vector store
#         current_vector_store = FAISS.from_documents(
#             documents=texts,
#             embedding=embeddings,
#             persist_directory=persist_dir
#         )
#         current_vector_store.persist()
#         print(f"Created vector store for CSV: {csv_path}")
#         return current_vector_store
    
#     except Exception as e:
#         print(f"Error creating vector store from CSV: {str(e)}")
#         raise

# def load_vector_store(file_basename):
#     """Load a previously created vector store"""
#     global current_vector_store
    
#     try:
#         persist_dir = os.path.join(VECTOR_DB_DIR, file_basename)
#         if os.path.exists(persist_dir):
#             embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
#             current_vector_store = FAISS(
#                 persist_directory=persist_dir,
#                 embedding_function=embeddings
#             )
#             return current_vector_store
#         else:
#             return None
#     except Exception as e:
#         print(f"Error loading vector store: {str(e)}")
#         return None

# # Utility functions

# def extract_text_from_pdf(file_path):
#     """Extract text from a PDF file"""
#     text = ""
#     with open(file_path, 'rb') as file:
#         reader = PyPDF2.PdfReader(file)
#         for page_num in range(len(reader.pages)):
#             text += reader.pages[page_num].extract_text() + "\n"
#     return text

# def get_data_summary(data):
#     """Generate a summary of the dataframe"""
#     if data is None:
#         return "No data available"
    
#     if 'text' in data.columns and len(data.columns) == 1:
#         # This is text data from a PDF
#         return data['text'].iloc[0][:1000] + "..." if len(data['text'].iloc[0]) > 1000 else data['text'].iloc[0]
    
#     # For tabular data
#     summary = {
#         "shape": data.shape,
#         "columns": list(data.columns),
#         "dtypes": {col: str(data[col].dtype) for col in data.columns},
#         "sample": data.head(5).to_dict(orient='records'),
#         "numeric_columns": list(data.select_dtypes(include=[np.number]).columns),
#         "categorical_columns": list(data.select_dtypes(include=['object']).columns),
#         "missing_values": data.isnull().sum().to_dict()
#     }
    
#     return summary

# def generate_data_description(data_info):
#     """Generate a description of the data"""
#     try:
#         llm = ChatOpenAI(temperature=0, api_key=openai_api_key)
#         prompt = PromptTemplate(
#             input_variables=["data_info"],
#             template="You are a helpful data analyst. Provide a brief, clear description of the dataset based on the information provided. Dataset: {data_info}"
#         )
#         chain = prompt | llm
#         return chain.invoke({"data_info": json.dumps(data_info)})
#     except Exception as e:
#         print(f"Error generating data description: {str(e)}")
#         return "Dataset containing " + str(data_info["rows"]) + " rows and " + str(data_info["columns"]) + " columns."

# def generate_response(query, data_summary, filename, data_description, llm):
#     """Generate a response to the query using LangChain"""
#     try:
#         # Create a prompt template
#         prompt = PromptTemplate(
#             input_variables=["filename", "data_description", "data_summary", "query"],
#             template="""
# You are an AI assistant that helps analyze data. The user has uploaded a file named {filename}.
# Here's a description of the data: {data_description}

# The data summary is:
# {data_summary}

# The user's query is: {query}

# Based on the data provided, respond to the query concisely but thoroughly. 
# If the query involves calculations, perform them on the data.
# If the query is asking for a visualization, explain what kind of visualization would be helpful.
# """
#         )
        
#         # Create the chain
#         chain = prompt | llm
        
#         # Run the chain
#         return chain.invoke({
#             "filename": filename,
#             "data_description": data_description,
#             "data_summary": json.dumps(data_summary, indent=2) if isinstance(data_summary, dict) else data_summary,
#             "query": query
#         })
        
#     except Exception as e:
#         print(f"Error generating response: {str(e)}")
#         return f"I couldn't process that query. Error: {str(e)}"

# def generate_graph_instructions(query, data_summary, graph_type, filename, llm):
#     """Generate graph creation instructions using LangChain"""
#     try:
#         # Create a prompt template
#         prompt = PromptTemplate(
#             input_variables=["filename", "data_summary", "graph_type", "query"],
#             template="""
# You are an AI assistant that helps create data visualizations. The user has uploaded a file named {filename}.

# The data summary is:
# {data_summary}

# The user wants to create a {graph_type} chart based on this query: {query}

# Return a JSON object with the following structure:
# ```json
# {{
#   "title": "Chart title",
#   "x_column": "Column name for x-axis",
#   "y_column": "Column name for y-axis (or list of columns for multiple series)",
#   "graph_type": "{graph_type}",
#   "color": "Color for the graph (optional)",
#   "figsize": [width, height],
#   "aggregation": "sum/mean/count/etc (optional)",
#   "group_by": "Column to group by (optional)",
#   "filters": {{"column": "value"}} (optional),
#   "explanation": "A brief explanation of what this visualization shows"
# }}
# ```

# Only include fields that make sense for this visualization. 
# Don't include 'x_column' and 'y_column' if the query doesn't clearly identify which columns to use.
# If the query is vague, infer the best columns to visualize based on the data.
# For "graph_type", use one of: "bar", "line", "pie", "scatter", "histogram", "box", "heatmap"
# """
#         )
        
#         # Create the chain
#         chain = prompt | llm
        
#         # Run the chain
#         return chain.invoke({
#             "filename": filename,
#             "data_summary": json.dumps(data_summary, indent=2) if isinstance(data_summary, dict) else data_summary,
#             "graph_type": graph_type,
#             "query": query
#         })
        
#     except Exception as e:
#         print(f"Error generating graph instructions: {str(e)}")
#         return json.dumps({
#             "title": "Visualization",
#             "graph_type": graph_type,
#             "explanation": f"I couldn't generate specific instructions for this visualization. Error: {str(e)}"
#         })

# def create_graph(data, instructions):
#     """Create a graph based on the instructions"""
#     plt.figure(figsize=instructions.get("figsize", (10, 6)))
#     plt.style.use('ggplot')
    
#     title = instructions.get("title", "Data Visualization")
#     graph_type = instructions.get("graph_type", "bar")
    
#     # Handle text data
#     if 'text' in data.columns and len(data.columns) == 1:
#         plt.text(0.5, 0.5, "Cannot create visualization for text data", 
#                  horizontalalignment='center', verticalalignment='center',
#                  fontsize=14, transform=plt.gca().transAxes)
#         plt.title(title)
        
#         # Convert plot to base64 string
#         buffer = io.BytesIO()
#         plt.savefig(buffer, format='png')
#         buffer.seek(0)
#         image_png = buffer.getvalue()
#         buffer.close()
#         plt.close()
        
#         return base64.b64encode(image_png).decode('utf-8')
    
#     # Apply filters if provided
#     filtered_data = data.copy()
#     if instructions.get("filters"):
#         for col, val in instructions["filters"].items():
#             if col in filtered_data.columns:
#                 filtered_data = filtered_data[filtered_data[col] == val]
    
#     # Apply grouping and aggregation if provided
#     if instructions.get("group_by") and instructions.get("aggregation") and instructions.get("y_column"):
#         x_col = instructions["group_by"]
#         y_col = instructions["y_column"]
#         agg_func = instructions["aggregation"]
        
#         if agg_func == "sum":
#             grouped_data = filtered_data.groupby(x_col)[y_col].sum().reset_index()
#         elif agg_func == "mean":
#             grouped_data = filtered_data.groupby(x_col)[y_col].mean().reset_index()
#         elif agg_func == "count":
#             grouped_data = filtered_data.groupby(x_col)[y_col].count().reset_index()
#         else:
#             grouped_data = filtered_data
#     else:
#         grouped_data = filtered_data
    
#     # Determine x and y columns
#     x_col = instructions.get("x_column")
#     y_col = instructions.get("y_column")
    
#     # If columns not specified, try to infer
#     if not x_col or x_col not in grouped_data.columns:
#         x_col = grouped_data.columns[0] if len(grouped_data.columns) > 0 else None
    
#     if not y_col or (isinstance(y_col, str) and y_col not in grouped_data.columns):
#         numeric_cols = grouped_data.select_dtypes(include=[np.number]).columns
#         y_col = numeric_cols[0] if len(numeric_cols) > 0 else None
    
#     # Handle case where we can't determine columns
#     if not x_col or not y_col:
#         plt.text(0.5, 0.5, "Cannot determine appropriate columns for visualization", 
#                  horizontalalignment='center', verticalalignment='center',
#                  fontsize=14, transform=plt.gca().transAxes)
#         plt.title(title)
        
#         # Convert plot to base64 string
#         buffer = io.BytesIO()
#         plt.savefig(buffer, format='png')
#         buffer.seek(0)
#         image_png = buffer.getvalue()
#         buffer.close()
#         plt.close()
        
#         return base64.b64encode(image_png).decode('utf-8')
    
#     # Create the graph based on type
#     color = instructions.get("color", None)
    
#     if graph_type == "bar":
#         if isinstance(y_col, list):
#             grouped_data[y_col].plot(kind='bar', ax=plt.gca())
#         else:
#             plt.bar(grouped_data[x_col], grouped_data[y_col], color=color)
#             plt.xlabel(x_col)
#             plt.ylabel(y_col)
            
#     elif graph_type == "line":
#         if isinstance(y_col, list):
#             grouped_data[y_col].plot(kind='line', ax=plt.gca())
#         else:
#             plt.plot(grouped_data[x_col], grouped_data[y_col], color=color)
#             plt.xlabel(x_col)
#             plt.ylabel(y_col)
            
#     elif graph_type == "pie":
#         plt.pie(grouped_data[y_col], labels=grouped_data[x_col], autopct='%1.1f%%')
#         plt.axis('equal')
            
#     elif graph_type == "scatter":
#         if isinstance(y_col, list) and len(y_col) > 1:
#             plt.scatter(grouped_data[y_col[0]], grouped_data[y_col[1]], color=color)
#             plt.xlabel(y_col[0])
#             plt.ylabel(y_col[1])
#         else:
#             plt.scatter(grouped_data[x_col], grouped_data[y_col], color=color)
#             plt.xlabel(x_col)
#             plt.ylabel(y_col)
            
#     elif graph_type == "histogram":
#         plt.hist(grouped_data[y_col], bins=10, color=color)
#         plt.xlabel(y_col)
#         plt.ylabel("Frequency")
            
#     elif graph_type == "box":
#         if isinstance(y_col, list):
#             grouped_data.boxplot(column=y_col)
#         else:
#             grouped_data.boxplot(column=y_col, by=x_col)
            
#     elif graph_type == "heatmap":
#         # For heatmap, need to pivot the data
#         if instructions.get("group_by") and y_col:
#             pivot_data = grouped_data.pivot_table(
#                 index=instructions["group_by"],
#                 columns=x_col,
#                 values=y_col,
#                 aggfunc=instructions.get("aggregation", "mean")
#             )
#             sns.heatmap(pivot_data, annot=True, cmap="YlGnBu")
#         else:
#             # If we can't create a proper heatmap, show correlation matrix
#             corr_matrix = grouped_data.select_dtypes(include=[np.number]).corr()
#             sns.heatmap(corr_matrix, annot=True, cmap="YlGnBu")
    
#     plt.title(title)
#     plt.xticks(rotation=45)
#     plt.tight_layout()
    
#     # Convert plot to base64 string
#     buffer = io.BytesIO()
#     plt.savefig(buffer, format='png')
#     buffer.seek(0)
#     image_png = buffer.getvalue()
#     buffer.close()
#     plt.close()
    
#     return base64.b64encode(image_png).decode('utf-8')

# # RAG functionality using LangChain
# @app.route('/rag_query', methods=['POST'])
# def rag_query():
#     global current_data, current_filename, current_vector_store
    
#     if current_data is None:
#         return jsonify({"error": "No data has been uploaded yet"}), 400
    
#     data = request.json
#     query_text = data.get('query', '')
    
#     if not query_text:
#         return jsonify({"error": "Query text is required"}), 400
    
#     try:
#         # If we don't have a vector store yet, try to load it or create it
#         if current_vector_store is None:
#             file_basename = os.path.splitext(current_filename)[0]
#             current_vector_store = load_vector_store(file_basename)
            
#             # If still None, try to create it based on file type
#             if current_vector_store is None:
#                 file_path = os.path.join(UPLOAD_FOLDER, current_filename)
#                 if current_filename.endswith('.pdf'):
#                     create_vector_store_from_pdf(file_path)
#                 elif current_filename.endswith('.csv'):
#                     create_vector_store_from_csv(file_path)
        
#         # Now use the vector store for RAG
#         if current_vector_store:
#             # Create a retrieval chain
#             llm = ChatOpenAI(temperature=0, api_key=openai_api_key)
            
#             # Create a RAG prompt template
#             template = """
# You are an AI assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. 
# If you don't know the answer, just say that you don't know.

# Context:
# {context}

# Question: {question}

# Answer:
# """
#             rag_prompt = PromptTemplate.from_template(template)
            
#             # Create the RAG chain
#             retriever = current_vector_store.as_retriever(search_kwargs={"k": 3})
#             rag_chain = (
#                 {"context": retriever, "question": lambda x: x["query"]}
#                 | rag_prompt
#                 | llm
#             )
            
#             # Run the chain
#             result = rag_chain.invoke({"query": query_text})
            
#             return jsonify({
#                 "response": result
#             })
#         else:
#             # Fallback to regular query without RAG
#             return jsonify({
#                 "response": "Vector store not available. Using standard processing instead.",
#                 "fallback": True
#             })
            
#     except Exception as e:
#         return jsonify({"error": f"Error processing RAG query: {str(e)}"}), 500

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)











# # File: app.py
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os
# import pandas as pd
# import numpy as np
# import matplotlib
# matplotlib.use('Agg')
# import matplotlib.pyplot as plt
# import seaborn as sns
# import io
# import base64
# from werkzeug.utils import secure_filename
# import PyPDF2
# import csv
# import openai
# import tempfile
# import json

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Set up OpenAI API key
# openai.api_key = os.environ.get("OPENAI_API_KEY")
# if not openai.api_key:
#     print("Warning: OPENAI_API_KEY environment variable not set")

# # Directory for uploaded files
# UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'nextcomponents1', 'uploads')
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# # Store the current working data
# current_data = None
# current_filename = None
# current_data_description = None

# @app.route('/process_file', methods=['POST'])
# def process_file():
#     global current_data, current_filename, current_data_description
    
#     if 'file' not in request.files:
#         return jsonify({"error": "No file part"}), 400
    
#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({"error": "No file selected"}), 400
    
#     filename = secure_filename(file.filename)
#     file_path = os.path.join(UPLOAD_FOLDER, filename)
#     file.save(file_path)
    
#     try:
#         # Process the file based on its extension
#         if filename.endswith('.csv'):
#             current_data = pd.read_csv(file_path)
#             current_filename = filename
            
#             # Generate a brief description of the data
#             data_info = {
#                 "rows": len(current_data),
#                 "columns": len(current_data.columns),
#                 "column_names": list(current_data.columns),
#                 "data_types": {col: str(current_data[col].dtype) for col in current_data.columns},
#                 "sample_data": current_data.head(5).to_dict(orient='records')
#             }
            
#             # Generate a description using GPT
#             current_data_description = generate_data_description(data_info)
            
#             return jsonify({
#                 "message": "CSV file processed successfully",
#                 "rows": len(current_data),
#                 "columns": len(current_data.columns),
#                 "description": current_data_description
#             })
            
#         elif filename.endswith('.pdf'):
#             # Extract text from PDF
#             text_content = extract_text_from_pdf(file_path)
            
#             # Create a temporary CSV file with the extracted text
#             temp_csv_path = os.path.join(UPLOAD_FOLDER, f"{os.path.splitext(filename)[0]}.csv")
            
#             # Check if the PDF contains tabular data or just text
#             if detect_table_in_pdf(text_content):
#                 # Try to parse tables from PDF (simplified approach)
#                 try:
#                     # This is a placeholder. In a real implementation, 
#                     # you would use a library like tabula-py or camelot-py
#                     current_data = pd.DataFrame({"text": [text_content]})
#                     current_data.to_csv(temp_csv_path, index=False)
#                 except Exception as e:
#                     current_data = pd.DataFrame({"text": [text_content]})
#                     current_data.to_csv(temp_csv_path, index=False)
#             else:
#                 # Just save as text
#                 current_data = pd.DataFrame({"text": [text_content]})
#                 current_data.to_csv(temp_csv_path, index=False)
            
#             current_filename = filename
#             current_data_description = f"Extracted content from PDF: {filename}"
            
#             return jsonify({
#                 "message": "PDF file processed successfully",
#                 "text_length": len(text_content),
#                 "description": current_data_description
#             })
        
#         else:
#             return jsonify({"error": "Unsupported file format"}), 400
            
#     except Exception as e:
#         return jsonify({"error": f"Error processing file: {str(e)}"}), 500

# @app.route('/query', methods=['POST'])
# def query_data():
#     global current_data, current_filename, current_data_description
    
#     # Check and load data if current_data is None
#     if current_data is None:
#         # Look for files in uploads directory
#         upload_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'nextcomponents1', 'uploads')
#         if os.path.exists(upload_dir):
#             files = [f for f in os.listdir(upload_dir) if f.endswith(('.csv', '.xlsx'))]
#             if files:
#                 # Get the most recent file
#                 newest_file = max([os.path.join(upload_dir, f) for f in files], key=os.path.getctime)
#                 try:
#                     if newest_file.endswith('.csv'):
#                         current_data = pd.read_csv(newest_file)
#                     else:
#                         current_data = pd.read_excel(newest_file)
#                     current_filename = os.path.basename(newest_file)
                    
#                     # Generate data description
#                     data_info = {
#                         "rows": len(current_data),
#                         "columns": len(current_data.columns),
#                         "column_names": list(current_data.columns),
#                         "data_types": {col: str(current_data[col].dtype) for col in current_data.columns},
#                         "sample_data": current_data.head(5).to_dict(orient='records')
#                     }
#                     current_data_description = generate_data_description(data_info)
#                 except Exception as e:
#                     return jsonify({"error": f"Error reading file: {str(e)}"}), 500
    
#     if current_data is None:
#         return jsonify({"error": "No data has been uploaded yet"}), 400
    
#     data = request.json
#     query_text = data.get('query', '')
    
#     if not query_text:
#         return jsonify({"error": "Query text is required"}), 400
    
#     try:
#         # Get data summary
#         data_summary = get_data_summary(current_data)
        
#         # Generate response using OpenAI
#         response = generate_response(query_text, data_summary, current_filename, current_data_description)
        
#         # Check if the response suggests a visualization
#         if any(keyword in response.lower() for keyword in ['graph', 'plot', 'chart', 'visualize', 'visualization']):
#             try:
#                 # Generate graph instructions
#                 graph_instructions = generate_graph_instructions(query_text, data_summary, 'auto', current_filename)
#                 instructions = json.loads(graph_instructions)
#                 graph_data = create_graph(current_data, instructions)
#             except Exception as e:
#                 graph_data = None
#                 print(f"Error generating graph: {str(e)}")
#         else:
#             graph_data = None
        
#         return jsonify({
#             "response": response,
#             "graph_data": graph_data
#         })
        
#     except Exception as e:
#         return jsonify({"error": f"Error processing query: {str(e)}"}), 500

# @app.route('/generate_graph', methods=['POST'])
# def generate_graph():
#     global current_data, current_filename
    
#     if current_data is None:
#         return jsonify({"error": "No data has been uploaded yet"}), 400
    
#     data = request.json
#     query_text = data.get('query', '')
#     graph_type = data.get('graph_type', 'bar')
    
#     if not query_text:
#         return jsonify({"error": "Query text is required"}), 400
    
#     try:
#         # Get data summary
#         data_summary = get_data_summary(current_data)
        
#         # Generate graph instructions using OpenAI
#         graph_instructions = generate_graph_instructions(query_text, data_summary, graph_type, current_filename)
        
#         # Parse the instructions
#         try:
#             instructions = json.loads(graph_instructions)
#         except:
#             # If parsing fails, attempt to extract JSON from text
#             import re
#             json_match = re.search(r'```json\s*([\s\S]*?)\s*```', graph_instructions)
#             if json_match:
#                 try:
#                     instructions = json.loads(json_match.group(1))
#                 except:
#                     instructions = {
#                         "title": "Visualization",
#                         "x_column": current_data.columns[0] if len(current_data.columns) > 0 else None,
#                         "y_column": current_data.columns[1] if len(current_data.columns) > 1 else None,
#                         "graph_type": graph_type,
#                         "explanation": "Could not parse graph instructions."
#                     }
#             else:
#                 # Fallback to basic instructions
#                 instructions = {
#                     "title": "Visualization",
#                     "x_column": current_data.columns[0] if len(current_data.columns) > 0 else None,
#                     "y_column": current_data.columns[1] if len(current_data.columns) > 1 else None,
#                     "graph_type": graph_type,
#                     "explanation": "Could not parse graph instructions."
#                 }
        
#         # Generate the graph
#         graph_image = create_graph(current_data, instructions)
        
#         return jsonify({
#             "response": instructions.get("explanation", "Here's the visualization you requested."),
#             "graph_data": graph_image
#         })
        
#     except Exception as e:
#         return jsonify({"error": f"Error generating graph: {str(e)}"}), 500

# # Utility functions

# def extract_text_from_pdf(file_path):
#     """Extract text from a PDF file"""
#     text = ""
#     with open(file_path, 'rb') as file:
#         reader = PyPDF2.PdfReader(file)
#         for page_num in range(len(reader.pages)):
#             text += reader.pages[page_num].extract_text() + "\n"
#     return text

# def detect_table_in_pdf(text):
#     """Simple heuristic to detect if a PDF might contain tabular data"""
#     # Check for patterns that might indicate tables
#     lines = text.split('\n')
#     comma_counts = [line.count(',') for line in lines]
    
#     # If many lines have the same number of commas, it might be a CSV-like table
#     from collections import Counter
#     comma_counter = Counter(comma_counts)
#     most_common_count, freq = comma_counter.most_common(1)[0]
    
#     return most_common_count > 1 and freq > 3  # Arbitrary threshold

# def get_data_summary(data):
#     """Generate a summary of the dataframe"""
#     if data is None:
#         return "No data available"
    
#     if 'text' in data.columns and len(data.columns) == 1:
#         # This is text data from a PDF
#         return data['text'].iloc[0][:1000] + "..." if len(data['text'].iloc[0]) > 1000 else data['text'].iloc[0]
    
#     # For tabular data
#     summary = {
#         "shape": data.shape,
#         "columns": list(data.columns),
#         "dtypes": {col: str(data[col].dtype) for col in data.columns},
#         "sample": data.head(5).to_dict(orient='records'),
#         "numeric_columns": list(data.select_dtypes(include=[np.number]).columns),
#         "categorical_columns": list(data.select_dtypes(include=['object']).columns),
#         "missing_values": data.isnull().sum().to_dict()
#     }
    
#     return summary

# def generate_data_description(data_info):
#     """Generate a description of the data using OpenAI"""
#     try:
#         response = openai.ChatCompletion.create(
#             model="gpt-4",
#             messages=[
#                 {"role": "system", "content": "You are a helpful data analyst. Provide a brief, clear description of the dataset based on the information provided."},
#                 {"role": "user", "content": f"Describe this dataset: {json.dumps(data_info)}"}
#             ],
#             max_tokens=150
#         )
#         return response.choices[0].message['content']
#     except Exception as e:
#         print(f"Error generating data description: {str(e)}")
#         return "Dataset containing " + str(data_info["rows"]) + " rows and " + str(data_info["columns"]) + " columns."

# def generate_response(query, data_summary, filename, data_description):
#     """Generate a response to the query using OpenAI"""
#     try:
#         # Create a prompt
#         prompt = f"""
# You are an AI assistant that helps analyze data. The user has uploaded a file named {filename}.
# Here's a description of the data: {data_description}

# The data summary is:
# {json.dumps(data_summary, indent=2) if isinstance(data_summary, dict) else data_summary}

# The user's query is: {query}

# Based on the data provided, respond to the query concisely but thoroughly. 
# If the query involves calculations, perform them on the data.
# If the query is asking for a visualization, explain what kind of visualization would be helpful.
# """
        
#         response = openai.ChatCompletion.create(
#             model="gpt-4",
#             messages=[
#                 {"role": "system", "content": "You are a helpful data analyst assistant."},
#                 {"role": "user", "content": prompt}
#             ],
#             max_tokens=500
#         )
#         return response.choices[0].message['content']
#     except Exception as e:
#         print(f"Error generating response: {str(e)}")
#         return f"I couldn't process that query. Error: {str(e)}"

# def generate_graph_instructions(query, data_summary, graph_type, filename):
#     """Generate graph creation instructions using OpenAI"""
#     try:
#         prompt = f"""
# You are an AI assistant that helps create data visualizations. The user has uploaded a file named {filename}.

# The data summary is:
# {json.dumps(data_summary, indent=2) if isinstance(data_summary, dict) else data_summary}

# The user wants to create a {graph_type} chart based on this query: {query}

# Return a JSON object with the following structure:
# ```json
# {{
#   "title": "Chart title",
#   "x_column": "Column name for x-axis",
#   "y_column": "Column name for y-axis (or list of columns for multiple series)",
#   "graph_type": "{graph_type}",
#   "color": "Color for the graph (optional)",
#   "figsize": [width, height],
#   "aggregation": "sum/mean/count/etc (optional)",
#   "group_by": "Column to group by (optional)",
#   "filters": {{"column": "value"}} (optional),
#   "explanation": "A brief explanation of what this visualization shows"
# }}
# ```

# Only include fields that make sense for this visualization. 
# Don't include 'x_column' and 'y_column' if the query doesn't clearly identify which columns to use.
# If the query is vague, infer the best columns to visualize based on the data.
# For "graph_type", use one of: "bar", "line", "pie", "scatter", "histogram", "box", "heatmap"
# """
        
#         response = openai.ChatCompletion.create(
#             model="gpt-4",
#             messages=[
#                 {"role": "system", "content": "You are a data visualization expert."},
#                 {"role": "user", "content": prompt}
#             ],
#             max_tokens=500
#         )
#         return response.choices[0].message['content']
#     except Exception as e:
#         print(f"Error generating graph instructions: {str(e)}")
#         return json.dumps({
#             "title": "Visualization",
#             "graph_type": graph_type,
#             "explanation": f"I couldn't generate specific instructions for this visualization. Error: {str(e)}"
#         })

# def create_graph(data, instructions):
#     """Create a graph based on the instructions"""
#     plt.figure(figsize=instructions.get("figsize", (10, 6)))
#     plt.style.use('ggplot')
    
#     title = instructions.get("title", "Data Visualization")
#     graph_type = instructions.get("graph_type", "bar")
    
#     # Handle text data
#     if 'text' in data.columns and len(data.columns) == 1:
#         plt.text(0.5, 0.5, "Cannot create visualization for text data", 
#                  horizontalalignment='center', verticalalignment='center',
#                  fontsize=14, transform=plt.gca().transAxes)
#         plt.title(title)
        
#         # Convert plot to base64 string
#         buffer = io.BytesIO()
#         plt.savefig(buffer, format='png')
#         buffer.seek(0)
#         image_png = buffer.getvalue()
#         buffer.close()
#         plt.close()
        
#         return base64.b64encode(image_png).decode('utf-8')
    
#     # Apply filters if provided
#     filtered_data = data.copy()
#     if instructions.get("filters"):
#         for col, val in instructions["filters"].items():
#             if col in filtered_data.columns:
#                 filtered_data = filtered_data[filtered_data[col] == val]
    
#     # Apply grouping and aggregation if provided
#     if instructions.get("group_by") and instructions.get("aggregation") and instructions.get("y_column"):
#         x_col = instructions["group_by"]
#         y_col = instructions["y_column"]
#         agg_func = instructions["aggregation"]
        
#         if agg_func == "sum":
#             grouped_data = filtered_data.groupby(x_col)[y_col].sum().reset_index()
#         elif agg_func == "mean":
#             grouped_data = filtered_data.groupby(x_col)[y_col].mean().reset_index()
#         elif agg_func == "count":
#             grouped_data = filtered_data.groupby(x_col)[y_col].count().reset_index()
#         else:
#             grouped_data = filtered_data
#     else:
#         grouped_data = filtered_data
    
#     # Determine x and y columns
#     x_col = instructions.get("x_column")
#     y_col = instructions.get("y_column")
    
#     # If columns not specified, try to infer
#     if not x_col or x_col not in grouped_data.columns:
#         x_col = grouped_data.columns[0] if len(grouped_data.columns) > 0 else None
    
#     if not y_col or (isinstance(y_col, str) and y_col not in grouped_data.columns):
#         numeric_cols = grouped_data.select_dtypes(include=[np.number]).columns
#         y_col = numeric_cols[0] if len(numeric_cols) > 0 else None
    
#     # Handle case where we can't determine columns
#     if not x_col or not y_col:
#         plt.text(0.5, 0.5, "Cannot determine appropriate columns for visualization", 
#                  horizontalalignment='center', verticalalignment='center',
#                  fontsize=14, transform=plt.gca().transAxes)
#         plt.title(title)
        
#         # Convert plot to base64 string
#         buffer = io.BytesIO()
#         plt.savefig(buffer, format='png')
#         buffer.seek(0)
#         image_png = buffer.getvalue()
#         buffer.close()
#         plt.close()
        
#         return base64.b64encode(image_png).decode('utf-8')
    
#     # Create the graph based on type
#     color = instructions.get("color", None)
    
#     if graph_type == "bar":
#         if isinstance(y_col, list):
#             grouped_data[y_col].plot(kind='bar', ax=plt.gca())
#         else:
#             plt.bar(grouped_data[x_col], grouped_data[y_col], color=color)
#             plt.xlabel(x_col)
#             plt.ylabel(y_col)
            
#     elif graph_type == "line":
#         if isinstance(y_col, list):
#             grouped_data[y_col].plot(kind='line', ax=plt.gca())
#         else:
#             plt.plot(grouped_data[x_col], grouped_data[y_col], color=color)
#             plt.xlabel(x_col)
#             plt.ylabel(y_col)
            
#     elif graph_type == "pie":
#         plt.pie(grouped_data[y_col], labels=grouped_data[x_col], autopct='%1.1f%%')
#         plt.axis('equal')
            
#     elif graph_type == "scatter":
#         if isinstance(y_col, list) and len(y_col) > 1:
#             plt.scatter(grouped_data[y_col[0]], grouped_data[y_col[1]], color=color)
#             plt.xlabel(y_col[0])
#             plt.ylabel(y_col[1])
#         else:
#             plt.scatter(grouped_data[x_col], grouped_data[y_col], color=color)
#             plt.xlabel(x_col)
#             plt.ylabel(y_col)
            
#     elif graph_type == "histogram":
#         plt.hist(grouped_data[y_col], bins=10, color=color)
#         plt.xlabel(y_col)
#         plt.ylabel("Frequency")
            
#     elif graph_type == "box":
#         if isinstance(y_col, list):
#             grouped_data.boxplot(column=y_col)
#         else:
#             grouped_data.boxplot(column=y_col, by=x_col)
            
#     elif graph_type == "heatmap":
#         # For heatmap, need to pivot the data
#         if instructions.get("group_by") and y_col:
#             pivot_data = grouped_data.pivot_table(
#                 index=instructions["group_by"],
#                 columns=x_col,
#                 values=y_col,
#                 aggfunc=instructions.get("aggregation", "mean")
#             )
#             sns.heatmap(pivot_data, annot=True, cmap="YlGnBu")
#         else:
#             # If we can't create a proper heatmap, show correlation matrix
#             corr_matrix = grouped_data.select_dtypes(include=[np.number]).corr()
#             sns.heatmap(corr_matrix, annot=True, cmap="YlGnBu")
    
#     plt.title(title)
#     plt.xticks(rotation=45)
#     plt.tight_layout()
    
#     # Convert plot to base64 string
#     buffer = io.BytesIO()
#     plt.savefig(buffer, format='png')
#     buffer.seek(0)
#     image_png = buffer.getvalue()
#     buffer.close()
#     plt.close()
    
#     return base64.b64encode(image_png).decode('utf-8')

# # Add a simple vectorization for PDF content - for RAG capabilities
# def vectorize_text(text):
#     """Create a simple vector representation of text for similarity search"""
#     # This is a very basic implementation
#     # In a real application, you would use embeddings from a model like OpenAI's
#     from sklearn.feature_extraction.text import TfidfVectorizer
#     vectorizer = TfidfVectorizer()
#     try:
#         return vectorizer.fit_transform([text])
#     except:
#         return None

# # Add route for RAG functionality with text content
# @app.route('/rag_query', methods=['POST'])
# def rag_query():
#     global current_data, current_filename
    
#     if current_data is None:
#         return jsonify({"error": "No data has been uploaded yet"}), 400
    
#     data = request.json
#     query_text = data.get('query', '')
    
#     if not query_text:
#         return jsonify({"error": "Query text is required"}), 400
    
#     try:
#         # If we have text data (from PDF)
#         if 'text' in current_data.columns and len(current_data.columns) == 1:
#             text_content = current_data['text'].iloc[0]
            
#             # Generate response using OpenAI with RAG approach
#             prompt = f"""
# You are an AI assistant that helps analyze documents. The user has uploaded a file named {current_filename}.
# Here is the content of the document:

# {text_content[:4000]}  # Limit text to avoid token limits

# The user's query is: {query_text}

# Based on the document content above, answer the query as accurately as possible.
# If the answer cannot be found in the document, say so clearly.
# """
            
#             response = openai.ChatCompletion.create(
#                 model="gpt-4",
#                 messages=[
#                     {"role": "system", "content": "You are a helpful document analysis assistant."},
#                     {"role": "user", "content": prompt}
#                 ],
#                 max_tokens=500
#             )
            
#             return jsonify({
#                 "response": response.choices[0].message['content']
#             })
            
#         # If we have tabular data (from CSV)
#         else:
#             # For tabular data, we'll use the query function but with more context
#             data_summary = get_data_summary(current_data)
            
#             # More detailed analysis of the data
#             stats_summary = {
#                 "numeric_stats": {col: {
#                     "min": float(current_data[col].min()) if pd.api.types.is_numeric_dtype(current_data[col]) else None,
#                     "max": float(current_data[col].max()) if pd.api.types.is_numeric_dtype(current_data[col]) else None,
#                     "mean": float(current_data[col].mean()) if pd.api.types.is_numeric_dtype(current_data[col]) else None,
#                     "median": float(current_data[col].median()) if pd.api.types.is_numeric_dtype(current_data[col]) else None
#                 } for col in current_data.columns if pd.api.types.is_numeric_dtype(current_data[col])},
#                 "categorical_counts": {col: current_data[col].value_counts().to_dict() 
#                                      for col in current_data.columns if pd.api.types.is_object_dtype(current_data[col])}
#             }
            
#             prompt = f"""
# You are an AI assistant that helps analyze data. The user has uploaded a file named {current_filename}.
# Here is a summary of the data:

# {json.dumps(data_summary, indent=2)}

# Additional statistics:
# {json.dumps(stats_summary, indent=2)}

# The user's query is: {query_text}

# Based on the data summary above, answer the query as accurately as possible.
# If calculations are needed, describe how they would be done.
# If a visualization would help, suggest what type would be most appropriate.
# """
            
#             response = openai.ChatCompletion.create(
#                 model="gpt-4",
#                 messages=[
#                     {"role": "system", "content": "You are a helpful data analysis assistant."},
#                     {"role": "user", "content": prompt}
#                 ],
#                 max_tokens=500
#             )
            
#             return jsonify({
#                 "response": response.choices[0].message['content']
#             })
            
#     except Exception as e:
#         return jsonify({"error": f"Error processing RAG query: {str(e)}"}), 500

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)