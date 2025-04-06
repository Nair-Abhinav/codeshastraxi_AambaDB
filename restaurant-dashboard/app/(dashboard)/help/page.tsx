"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, ChevronRight, FileText, HelpCircle, MessageCircle, Search, ThumbsUp, Video } from "lucide-react"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample FAQ data
  const faqs = [
    {
      question: "How do I create a new dashboard?",
      answer:
        "To create a new dashboard, navigate to the Dashboards section and click on the 'Create Dashboard' button. You can then select a template or start from scratch, add widgets, and customize your layout.",
    },
    {
      question: "How do I invite team members?",
      answer:
        "You can invite team members by going to the Team section in the sidebar, clicking on 'Invite Members', and entering their email addresses. You can also set their permission levels during the invitation process.",
    },
    {
      question: "How do I export data from charts?",
      answer:
        "To export data from charts, hover over any chart and click on the three-dot menu in the top right corner. Select 'Export Data' and choose your preferred format (CSV, Excel, or PDF).",
    },
    {
      question: "How do I set up notifications?",
      answer:
        "You can set up notifications by going to Settings > Notifications. From there, you can configure email alerts, push notifications, and set thresholds for different metrics that will trigger notifications.",
    },
    {
      question: "How do I change my password?",
      answer:
        "To change your password, go to Settings > Security, enter your current password, and then enter and confirm your new password. Make sure to use a strong password with a mix of letters, numbers, and special characters.",
    },
    {
      question: "How do I customize chart colors?",
      answer:
        "You can customize chart colors by editing any chart and navigating to the 'Appearance' tab. From there, you can select from predefined color palettes or create your own custom color scheme.",
    },
  ]

  // Sample documentation categories
  const docCategories = [
    { title: "Getting Started", icon: BookOpen, count: 5 },
    { title: "Dashboards", icon: FileText, count: 8 },
    { title: "Data Visualization", icon: ChevronRight, count: 12 },
    { title: "User Management", icon: ChevronRight, count: 6 },
    { title: "API Reference", icon: ChevronRight, count: 15 },
    { title: "Integrations", icon: ChevronRight, count: 9 },
    { title: "Security", icon: ChevronRight, count: 4 },
    { title: "Troubleshooting", icon: ChevronRight, count: 7 },
  ]

  // Sample video tutorials
  const videoTutorials = [
    { title: "Getting Started with DataViz", duration: "5:32", thumbnail: "/placeholder.svg?height=120&width=200" },
    { title: "Creating Your First Dashboard", duration: "8:45", thumbnail: "/placeholder.svg?height=120&width=200" },
    { title: "Advanced Chart Customization", duration: "12:18", thumbnail: "/placeholder.svg?height=120&width=200" },
    { title: "Working with Data Sources", duration: "10:05", thumbnail: "/placeholder.svg?height=120&width=200" },
  ]

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Help Center</h1>
              <p className="text-gray-400 mt-1">Find answers, tutorials, and support resources</p>
            </div>
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700">
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for help articles, tutorials, and FAQs..."
              className="pl-10 py-6 text-lg bg-zinc-900 border-white/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="bg-zinc-900 border border-white/10 p-1">
              <TabsTrigger value="faq" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
                FAQ
              </TabsTrigger>
              <TabsTrigger
                value="documentation"
                className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
              >
                Documentation
              </TabsTrigger>
              <TabsTrigger value="videos" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
                Video Tutorials
              </TabsTrigger>
              <TabsTrigger
                value="community"
                className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
              >
                Community
              </TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="mt-6 space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="bg-zinc-900 border border-white/10">
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>
                      {searchQuery ? `Search results for "${searchQuery}"` : "Common questions and answers"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, i) => (
                          <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
                            <AccordionTrigger className="text-left hover:text-violet-400 hover:no-underline">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-400">{faq.answer}</AccordionContent>
                          </AccordionItem>
                        ))
                      ) : (
                        <div className="py-8 text-center">
                          <HelpCircle className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                          <h3 className="text-lg font-medium mb-2">No results found</h3>
                          <p className="text-gray-400">
                            We couldn't find any FAQs matching your search. Try different keywords or contact support.
                          </p>
                        </div>
                      )}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="documentation" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="md:col-span-1"
                >
                  <Card className="bg-zinc-900 border border-white/10">
                    <CardHeader>
                      <CardTitle>Documentation</CardTitle>
                      <CardDescription>Browse by category</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-1">
                        {docCategories.map((category, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                          >
                            <Button variant="ghost" className="w-full justify-start px-4 py-6 hover:bg-white/5">
                              <category.icon className="mr-2 h-5 w-5 text-violet-400" />
                              <span>{category.title}</span>
                              <Badge className="ml-auto bg-zinc-800 text-gray-400">{category.count}</Badge>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="md:col-span-2"
                >
                  <Card className="bg-zinc-900 border border-white/10">
                    <CardHeader>
                      <CardTitle>Getting Started</CardTitle>
                      <CardDescription>Learn the basics of using our platform</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        "Introduction to DataViz",
                        "Setting Up Your Account",
                        "Creating Your First Dashboard",
                        "Understanding Data Sources",
                        "Customizing Charts and Visualizations",
                      ].map((article, i) => (
                        <div
                          key={i}
                          className="flex items-center p-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <FileText className="h-5 w-5 mr-3 text-violet-400" />
                          <div>
                            <p className="font-medium">{article}</p>
                            <p className="text-sm text-gray-400">Last updated: 2 weeks ago</p>
                          </div>
                          <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                        </div>
                      ))}

                      <div className="pt-4">
                        <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">
                          View All Documentation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="bg-zinc-900 border border-white/10">
                  <CardHeader>
                    <CardTitle>Video Tutorials</CardTitle>
                    <CardDescription>Learn through step-by-step video guides</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {videoTutorials.map((video, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className="group cursor-pointer"
                        >
                          <div className="relative rounded-lg overflow-hidden">
                            <div
                              className="aspect-video bg-zinc-800 bg-cover bg-center"
                              style={{ backgroundImage: `url(${video.thumbnail})` }}
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="h-16 w-16 rounded-full bg-violet-600/90 flex items-center justify-center">
                                <Video className="h-8 w-8" />
                              </div>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
                              {video.duration}
                            </div>
                          </div>
                          <h3 className="font-medium mt-2 group-hover:text-violet-400 transition-colors">
                            {video.title}
                          </h3>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">
                        View All Video Tutorials
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="community" className="mt-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="bg-zinc-900 border border-white/10">
                  <CardHeader>
                    <CardTitle>Community Forum</CardTitle>
                    <CardDescription>Connect with other users and share knowledge</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Recent Discussions</h3>
                      {[
                        {
                          title: "Best practices for dashboard organization",
                          replies: 12,
                          views: 234,
                          author: "Alex J.",
                        },
                        { title: "How to create custom chart types?", replies: 8, views: 156, author: "Sarah W." },
                        { title: "Integrating with external APIs", replies: 15, views: 302, author: "Michael C." },
                        { title: "Performance optimization tips", replies: 6, views: 178, author: "Emily R." },
                      ].map((discussion, i) => (
                        <div
                          key={i}
                          className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium hover:text-violet-400 transition-colors">
                                {discussion.title}
                              </h4>
                              <div className="flex items-center mt-1 text-sm text-gray-400">
                                <span>{discussion.replies} replies</span>
                                <span className="mx-2">•</span>
                                <span>{discussion.views} views</span>
                              </div>
                            </div>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={discussion.author} />
                              <AvatarFallback>{discussion.author[0]}</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Popular Topics</h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Dashboard Design",
                          "Data Integration",
                          "Performance",
                          "Charts",
                          "API",
                          "Security",
                          "User Management",
                          "Customization",
                          "Troubleshooting",
                          "Best Practices",
                        ].map((topic, i) => (
                          <Badge key={i} className="bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex gap-4">
                      <Button className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700">
                        Join Community
                      </Button>
                      <Button variant="outline" className="flex-1 border-white/10">
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Ask a Question
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

