import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Book, Flag } from 'lucide-react'
import api from '@/util/api' // axios instance for API calls

const NewLanguageDialog = ({ isOpen, onClose, onAddLanguage }) => {
  const [formData, setFormData] = useState({
    language_id: '',
    title: '',
    description: '',
    difficulty: '',
    total_lessons: 10,
    topics: [],
    flag_image_url: '',
  })

  const [availableCourses, setAvailableCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses')
        console.log('Courses API response:', response.data)
        if (Array.isArray(response.data)) {
          setAvailableCourses(response.data)
        } else {
          console.error('Unexpected API response format:', response.data)
          setAvailableCourses([])
        }
      } catch (err) {
        console.error('Error fetching courses:', err)
        setAvailableCourses([])
      }
    }
    fetchCourses()
  }, [])

  const handleLanguageChange = (value) => {
    const selected = availableCourses.find(course => course.language_id === value)
    if (selected) {
      setSelectedCourse(selected)
      setFormData({
        language_id: value,
        title: selected.title,
        description: selected.description,
        difficulty: selected.difficulty,
        total_lessons: 10,
        topics: selected.topics,
        flag_image_url: selected.flag_image_url,
      })
    }
  }

  const handleAddLanguage = async () => {
    if (!formData.language_id) {
      alert("Please select a language")
      return
    }

    const payload = {
      language_id: formData.language_id,
      course_id: selectedCourse.course_id,
    }

    try {
      await onAddLanguage(payload)
      onClose()
    } catch (err) {
      console.error("Error details:", err)
      if (err.response) {
        if (err.response.status === 400) {
          alert(err.response.data.message)
        } else {
          alert(`Unexpected error: ${err.response.status}`)
        }
      } else {
        alert("Failed to add language. Please try again.")
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Add a New Language</DialogTitle>
          <DialogDescription className="text-center">
            Choose a language to start your learning journey
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select value={formData.language_id} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {availableCourses.length > 0 ? (
                availableCourses.map((course) => (
                  <SelectItem key={course.language_id} value={course.language_id}>
                    <div className="flex items-center">
                      <img src={course.flag_image_url} alt={`${course.title} flag`} className="w-6 h-4 mr-2" />
                      {course.title}
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled>No available courses</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        {selectedCourse && (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <img src={selectedCourse.flag_image_url} alt={`${selectedCourse.title} flag`} className="w-10 h-6 mr-3" />
                <h3 className="text-xl font-semibold">{selectedCourse.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{selectedCourse.description}</p>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Book className="w-4 h-4 mr-2" />
                <span>Difficulty: {selectedCourse.difficulty}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Globe className="w-4 h-4 mr-2" />
                <span>{selectedCourse.topics.length} topics</span>
              </div>
              <Label className="font-semibold mb-2">Topics:</Label>
              <ScrollArea className="h-24 w-full rounded-md border p-2">
                {selectedCourse.topics.map((topic) => (
                  <div key={topic.id} className="flex items-center py-1">
                    <Flag className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{topic.name}</span>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        )}
        <DialogFooter className="mt-6">
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button 
            onClick={handleAddLanguage} 
            className="bg-[#26647e] hover:bg-[#1e4f62]"
            disabled={!formData.language_id}
          >
            Start Learning
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewLanguageDialog

