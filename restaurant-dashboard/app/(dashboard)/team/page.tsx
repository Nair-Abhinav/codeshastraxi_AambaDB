"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react"
import { useState } from "react"

// Sample team data
const teamMembers = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Frontend Developer",
    image: "/placeholder.svg?height=100&width=100",
    status: "Active",
    location: "San Francisco, CA",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Experienced frontend developer with expertise in React, Next.js, and modern CSS frameworks.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    social: {
      github: "github.com/alexj",
      twitter: "twitter.com/alexj",
      linkedin: "linkedin.com/in/alexj",
    },
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "UI/UX Designer",
    image: "/placeholder.svg?height=100&width=100",
    status: "Active",
    location: "New York, NY",
    email: "sarah@example.com",
    phone: "+1 (555) 234-5678",
    bio: "Creative designer focused on creating intuitive and beautiful user experiences.",
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
    social: {
      github: "github.com/sarahw",
      twitter: "twitter.com/sarahw",
      linkedin: "linkedin.com/in/sarahw",
    },
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Backend Developer",
    image: "/placeholder.svg?height=100&width=100",
    status: "Away",
    location: "Seattle, WA",
    email: "michael@example.com",
    phone: "+1 (555) 345-6789",
    bio: "Backend specialist with strong knowledge of distributed systems and database optimization.",
    skills: ["Node.js", "Python", "PostgreSQL", "Redis"],
    social: {
      github: "github.com/michaelc",
      twitter: "twitter.com/michaelc",
      linkedin: "linkedin.com/in/michaelc",
    },
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    role: "Product Manager",
    image: "/placeholder.svg?height=100&width=100",
    status: "Active",
    location: "Austin, TX",
    email: "emily@example.com",
    phone: "+1 (555) 456-7890",
    bio: "Product manager with a background in user research and agile methodologies.",
    skills: ["Product Strategy", "Agile", "User Research", "Roadmapping"],
    social: {
      github: "github.com/emilyr",
      twitter: "twitter.com/emilyr",
      linkedin: "linkedin.com/in/emilyr",
    },
  },
  {
    id: 5,
    name: "David Kim",
    role: "DevOps Engineer",
    image: "/placeholder.svg?height=100&width=100",
    status: "Offline",
    location: "Chicago, IL",
    email: "david@example.com",
    phone: "+1 (555) 567-8901",
    bio: "Infrastructure specialist focused on automation, CI/CD, and cloud architecture.",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
    social: {
      github: "github.com/davidk",
      twitter: "twitter.com/davidk",
      linkedin: "linkedin.com/in/davidk",
    },
  },
  {
    id: 6,
    name: "Lisa Thompson",
    role: "Data Scientist",
    image: "/placeholder.svg?height=100&width=100",
    status: "Active",
    location: "Boston, MA",
    email: "lisa@example.com",
    phone: "+1 (555) 678-9012",
    bio: "Data scientist with expertise in machine learning and predictive analytics.",
    skills: ["Python", "TensorFlow", "PyTorch", "Data Visualization"],
    social: {
      github: "github.com/lisat",
      twitter: "twitter.com/lisat",
      linkedin: "linkedin.com/in/lisat",
    },
  },
]

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMember, setSelectedMember] = useState<number | null>(null)

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedMemberData = teamMembers.find((member) => member.id === selectedMember)

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Team</h1>
              <p className="text-gray-400 mt-1">Manage your team members and their access</p>
            </div>
            <div className="flex items-center gap-2">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or role..."
              className="pl-10 bg-zinc-900 border-white/10 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <Card className="bg-zinc-900 border border-white/10">
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Total: {teamMembers.length} members</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {filteredMembers.map((member, i) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                      >
                        <button
                          className={`w-full flex items-center p-4 hover:bg-white/5 transition-colors ${selectedMember === member.id ? "bg-white/10" : ""}`}
                          onClick={() => setSelectedMember(member.id)}
                        >
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={member.image} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="text-left">
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-400">{member.role}</p>
                          </div>
                          <Badge
                            className={`ml-auto ${
                              member.status === "Active"
                                ? "bg-green-500/20 text-green-400"
                                : member.status === "Away"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {member.status}
                          </Badge>
                        </button>
                      </motion.div>
                    ))}

                    {filteredMembers.length === 0 && (
                      <div className="p-4 text-center text-gray-400">No members found matching your search.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              {selectedMemberData ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-zinc-900 border border-white/10">
                    <CardHeader className="pb-0">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={selectedMemberData.image} alt={selectedMemberData.name} />
                          <AvatarFallback className="text-2xl">{selectedMemberData.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-2xl">{selectedMemberData.name}</CardTitle>
                          <CardDescription className="text-lg mt-1">{selectedMemberData.role}</CardDescription>
                          <div className="flex items-center mt-2">
                            <Badge
                              className={
                                selectedMemberData.status === "Active"
                                  ? "bg-green-500/20 text-green-400"
                                  : selectedMemberData.status === "Away"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-gray-500/20 text-gray-400"
                              }
                            >
                              {selectedMemberData.status}
                            </Badge>
                            <div className="flex items-center ml-4 text-gray-400 text-sm">
                              <MapPin className="h-3 w-3 mr-1" />
                              {selectedMemberData.location}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="mt-6 space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Bio</h3>
                        <p>{selectedMemberData.bio}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-2">Contact Information</h3>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{selectedMemberData.email}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{selectedMemberData.phone}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-2">Social Profiles</h3>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Github className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{selectedMemberData.social.github}</span>
                            </div>
                            <div className="flex items-center">
                              <Twitter className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{selectedMemberData.social.twitter}</span>
                            </div>
                            <div className="flex items-center">
                              <Linkedin className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{selectedMemberData.social.linkedin}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedMemberData.skills.map((skill, i) => (
                            <Badge key={i} className="bg-violet-500/20 text-violet-400 hover:bg-violet-500/30">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" className="border-white/10">
                          Edit Profile
                        </Button>
                        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700">
                          Send Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card className="bg-zinc-900 border border-white/10 h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <p className="text-gray-400">Select a team member to view their details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

