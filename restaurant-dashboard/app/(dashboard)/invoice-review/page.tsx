"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileUp, Upload, CheckCircle, AlertCircle, Clock, FileText } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"

// Sample invoices data
const invoicesData = [
  {
    id: "i1",
    filename: "invoice-july-15.pdf",
    timestamp: "2023-07-15 14:30:22",
    category: "Overcharging",
    status: "pending",
    submittedBy: "John Doe",
  },
  {
    id: "i2",
    filename: "invoice-july-14.pdf",
    timestamp: "2023-07-14 15:12:45",
    category: "Missing Items",
    status: "approved",
    submittedBy: "Sarah Smith",
  },
  {
    id: "i3",
    filename: "invoice-july-13.pdf",
    timestamp: "2023-07-13 16:05:33",
    category: "Unauthorized Discounts",
    status: "rejected",
    submittedBy: "Mike Johnson",
  },
  {
    id: "i4",
    filename: "invoice-july-12.pdf",
    timestamp: "2023-07-12 14:22:18",
    category: "Void After Sale",
    status: "pending",
    submittedBy: "Emily Davis",
  },
  {
    id: "i5",
    filename: "invoice-july-11.pdf",
    timestamp: "2023-07-11 13:45:09",
    category: "Overcharging",
    status: "approved",
    submittedBy: "Robert Wilson",
  },
]

export default function InvoiceReviewPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setUploadedFiles(acceptedFiles)
    },
  })

  const handleUpload = async () => {
    if (uploadedFiles.length === 0 || !selectedCategory) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadedFiles([])
          setSelectedCategory("")
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Invoice Review</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="border-border bg-surface">
            <CardHeader>
              <CardTitle>Upload Invoice</CardTitle>
              <CardDescription>Submit an invoice for manual review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                {...getRootProps()}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background p-12 text-center transition-all hover:bg-surface/50",
                  isDragActive && "border-accent bg-accent/5",
                )}
              >
                <input {...getInputProps()} />
                <Upload className={cn("mb-4 h-12 w-12 text-text-secondary", isDragActive && "text-accent")} />
                <h3 className="mb-2 text-lg font-medium">
                  {isDragActive ? "Drop the files here" : "Drag & Drop Files"}
                </h3>
                <p className="mb-4 text-sm text-text-secondary">or click to browse files</p>
                <p className="text-xs text-text-secondary">Supported formats: PDF, JPG, PNG</p>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="rounded-md border border-border bg-background p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-text-secondary" />
                      <span className="text-sm font-medium">{uploadedFiles[0].name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 rounded-full p-0 text-text-secondary hover:text-text"
                      onClick={() => setUploadedFiles([])}
                    >
                      &times;
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="category">Suspected Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overcharging">Overcharging</SelectItem>
                    <SelectItem value="missing-items">Missing Items</SelectItem>
                    <SelectItem value="unauthorized-discounts">Unauthorized Discounts</SelectItem>
                    <SelectItem value="void-after-sale">Void After Sale</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-background">
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={isUploading || uploadedFiles.length === 0 || !selectedCategory}
                className="w-full bg-accent hover:bg-accent/90"
              >
                <FileUp className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload Invoice"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Invoices Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-border bg-surface">
            <CardHeader>
              <CardTitle>Uploaded Invoices</CardTitle>
              <CardDescription>Review status of submitted invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoicesData.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{invoice.filename}</span>
                          <span className="text-xs text-text-secondary">{invoice.timestamp}</span>
                        </div>
                      </TableCell>
                      <TableCell>{invoice.category}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            invoice.status === "approved" && "border-risk-low text-risk-low",
                            invoice.status === "pending" && "border-risk-medium text-risk-medium",
                            invoice.status === "rejected" && "border-risk-high text-risk-high",
                          )}
                        >
                          {invoice.status === "approved" && (
                            <>
                              <CheckCircle className="mr-1 h-3 w-3" /> Approved
                            </>
                          )}
                          {invoice.status === "pending" && (
                            <>
                              <Clock className="mr-1 h-3 w-3" /> Pending
                            </>
                          )}
                          {invoice.status === "rejected" && (
                            <>
                              <AlertCircle className="mr-1 h-3 w-3" /> Rejected
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{invoice.submittedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

