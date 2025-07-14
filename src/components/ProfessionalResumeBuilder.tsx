import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Eye, Plus, Trash2, User, Briefcase, GraduationCap, Award, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    summary: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications: string[];
}

interface ProfessionalResumeBuilderProps {
  initialData?: Partial<ResumeData>;
}

const ProfessionalResumeBuilder: React.FC<ProfessionalResumeBuilderProps> = ({ initialData }) => {
  const { toast } = useToast();
  const resumeRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'classic' | 'minimal'>('modern');
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: initialData?.personalInfo?.name || '',
      email: initialData?.personalInfo?.email || '',
      phone: initialData?.personalInfo?.phone || '',
      location: initialData?.personalInfo?.location || '',
      website: initialData?.personalInfo?.website || '',
      linkedin: initialData?.personalInfo?.linkedin || '',
      summary: initialData?.personalInfo?.summary || '',
    },
    experience: initialData?.experience || [],
    education: initialData?.education || [],
    skills: initialData?.skills || [],
    certifications: initialData?.certifications || []
  });

  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      graduationDate: '',
      gpa: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setResumeData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const downloadPDF = async () => {
    if (!resumeRef.current) return;

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`);
      
      toast({
        title: "Success",
        description: "Resume downloaded successfully!"
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getTemplateStyles = () => {
    switch (selectedTemplate) {
      case 'modern':
        return {
          headerBg: 'bg-gradient-to-r from-blue-600 to-purple-600',
          headerText: 'text-white',
          sectionBg: 'bg-gray-50',
          accentColor: 'text-blue-600',
          borderColor: 'border-blue-200'
        };
      case 'classic':
        return {
          headerBg: 'bg-gray-800',
          headerText: 'text-white',
          sectionBg: 'bg-white',
          accentColor: 'text-gray-800',
          borderColor: 'border-gray-300'
        };
      case 'minimal':
        return {
          headerBg: 'bg-white',
          headerText: 'text-gray-800',
          sectionBg: 'bg-white',
          accentColor: 'text-gray-600',
          borderColor: 'border-gray-200'
        };
      default:
        return {
          headerBg: 'bg-gradient-to-r from-blue-600 to-purple-600',
          headerText: 'text-white',
          sectionBg: 'bg-gray-50',
          accentColor: 'text-blue-600',
          borderColor: 'border-blue-200'
        };
    }
  };

  const templateStyles = getTemplateStyles();

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Resume Builder Form */}
      <div className="space-y-6 max-h-screen overflow-y-auto">
        {/* Template Selection */}
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Template Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedTemplate} onValueChange={(value: 'modern' | 'classic' | 'minimal') => setSelectedTemplate(value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Full Name</Label>
                <Input
                  id="name"
                  value={resumeData.personalInfo.name}
                  onChange={(e) => updatePersonalInfo('name', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">Phone</Label>
                <Input
                  id="phone"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-white">Location</Label>
                <Input
                  id="location"
                  value={resumeData.personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="City, State"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary" className="text-white">Professional Summary</Label>
              <Textarea
                id="summary"
                value={resumeData.personalInfo.summary}
                onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                rows={3}
                placeholder="Brief professional summary..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Experience
              </CardTitle>
              <Button onClick={addExperience} size="sm" className="bg-gradient-to-r from-orange-500 to-pink-500">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-white font-medium">Experience Entry</h4>
                  <Button onClick={() => removeExperience(exp.id)} size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Input
                    placeholder="Job Title"
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Input
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <Input
                    placeholder="Location"
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Input
                    placeholder="Start Date"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Input
                    placeholder="End Date"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                    disabled={exp.current}
                  />
                </div>
                <Textarea
                  placeholder="Job description and achievements..."
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  rows={3}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education
              </CardTitle>
              <Button onClick={addEducation} size="sm" className="bg-gradient-to-r from-orange-500 to-pink-500">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-white font-medium">Education Entry</h4>
                  <Button onClick={() => removeEducation(edu.id)} size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Input
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Input
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    placeholder="Location"
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Input
                    placeholder="Graduation Date"
                    value={edu.graduationDate}
                    onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Input
                    placeholder="GPA (optional)"
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button onClick={addSkill} size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <Badge key={index} className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                  {skill}
                  <button onClick={() => removeSkill(index)} className="ml-2 hover:text-red-200">
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="w-5 h-5" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a certification"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                onKeyPress={(e) => e.key === 'Enter' && addCertification()}
              />
              <Button onClick={addCertification} size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                  <span className="text-white text-sm">{cert}</span>
                  <Button onClick={() => removeCertification(index)} size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={downloadPDF}
            className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="lg:sticky lg:top-6">
        <div 
          ref={resumeRef}
          className="bg-white text-black min-h-[800px] shadow-2xl"
          style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}
        >
          {/* Header */}
          <div className={`${templateStyles.headerBg} ${templateStyles.headerText} p-6 -m-6 mb-6`}>
            <h1 className="text-3xl font-bold mb-2">{resumeData.personalInfo.name || 'Your Name'}</h1>
            <div className="flex flex-wrap gap-4 text-sm opacity-90">
              {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
              {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
              {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
            </div>
          </div>

          {/* Professional Summary */}
          {resumeData.personalInfo.summary && (
            <div className="mb-6">
              <h2 className={`text-xl font-bold ${templateStyles.accentColor} mb-3 border-b ${templateStyles.borderColor} pb-1`}>
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {resumeData.experience.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-xl font-bold ${templateStyles.accentColor} mb-3 border-b ${templateStyles.borderColor} pb-1`}>
                Professional Experience
              </h2>
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-800">{exp.title}</h3>
                    <span className="text-gray-600 text-sm">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{exp.company} • {exp.location}</p>
                  {exp.description && <p className="text-gray-700 text-sm">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {resumeData.education.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-xl font-bold ${templateStyles.accentColor} mb-3 border-b ${templateStyles.borderColor} pb-1`}>
                Education
              </h2>
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                      <p className="text-gray-600 text-sm">{edu.institution} • {edu.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600 text-sm">{edu.graduationDate}</p>
                      {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {resumeData.skills.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-xl font-bold ${templateStyles.accentColor} mb-3 border-b ${templateStyles.borderColor} pb-1`}>
                Technical Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resumeData.certifications.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-xl font-bold ${templateStyles.accentColor} mb-3 border-b ${templateStyles.borderColor} pb-1`}>
                Certifications
              </h2>
              <ul className="space-y-1">
                {resumeData.certifications.map((cert, index) => (
                  <li key={index} className="text-gray-700 text-sm">• {cert}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalResumeBuilder;
