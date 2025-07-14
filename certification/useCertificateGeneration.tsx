import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useCertificateTemplates } from '@/hooks/useCertificateTemplates';
import { CertificateData } from '@/components/CertificateTemplate';

export interface CertificateGenerationResult {
  success: boolean;
  certificateId?: string;
  certificateUrl?: string;
  verificationCode?: string;
  error?: string;
}

export const useCertificateGeneration = () => {
  const [generating, setGenerating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { getTemplateForCourse } = useCertificateTemplates();

  const generateCertificate = async (
    courseId: string,
    certificateName?: string
  ): Promise<CertificateGenerationResult> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    setGenerating(true);
    try {
      // Check if user has completed the course
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select('completed, progress')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (enrollmentError) throw enrollmentError;

      if (!enrollment?.completed || (enrollment?.progress || 0) < 100) {
        toast({
          title: "Course Not Completed",
          description: "You must complete the course before generating a certificate.",
          variant: "destructive"
        });
        return { success: false, error: 'Course not completed' };
      }

      // Get course details
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Get certificate template for this course
      const template = await getTemplateForCourse(courseId);
      if (!template) {
        throw new Error('No certificate template found for this course');
      }

      // Prepare certificate data
      const certificateData: CertificateData = {
        studentName: profile.full_name || 'Student',
        courseTitle: course.title,
        courseDescription: course.description || `A comprehensive course in ${course.category}`,
        completionDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        instructorName: course.instructor || 'Instructor',
        courseCategory: course.category || 'General',
        verificationCode: '', // Will be set by the database function
        platformName: 'SKILL BHARAT',
        platformTagline: 'Empowering Skills, Building Futures'
      };

      // Generate a verification code
      const verificationCode = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Update certificate data with verification code
      certificateData.verificationCode = verificationCode;

      // Generate PDF certificate URL
      const certificateUrl = await generateCertificatePDF(template, certificateData);

      // Try to save to certificates table (if it exists)
      let certificateId = `cert-${Date.now()}`;
      try {
        const { data: certResult, error: certError } = await supabase
          .from('certificates')
          .insert({
            user_id: user.id,
            course_id: courseId,
            certificate_name: certificateName || `${course.title} - Certificate`,
            certificate_url: certificateUrl,
            verification_code: verificationCode
          })
          .select()
          .single();

        if (!certError && certResult) {
          certificateId = certResult.id;
        }
      } catch (dbError) {
        console.warn('Could not save to certificates table:', dbError);
        // Continue anyway - the certificate was generated
      }

      toast({
        title: "Certificate Generated!",
        description: "Your certificate has been generated successfully.",
      });

      return {
        success: true,
        certificateId,
        certificateUrl,
        verificationCode
      };

    } catch (error: any) {
      console.error('Error generating certificate:', error);
      toast({
        title: "Error",
        description: "Failed to generate certificate: " + error.message,
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setGenerating(false);
    }
  };

  const downloadCertificate = async (certificateId: string) => {
    try {
      // Try to get certificate from certificates table
      const { data: certificate, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('id', certificateId)
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.warn('Could not fetch certificate:', error);
        toast({
          title: "Error",
          description: "Certificate not found",
          variant: "destructive"
        });
        return;
      }

      if (certificate.certificate_url) {
        // Download existing PDF
        window.open(certificate.certificate_url, '_blank');
      } else {
        toast({
          title: "Error",
          description: "Certificate file not available",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error downloading certificate:', error);
      toast({
        title: "Error",
        description: "Failed to download certificate",
        variant: "destructive"
      });
    }
  };

  return {
    generateCertificate,
    downloadCertificate,
    generating
  };
};

// Helper function to generate certificate PDF using template
const generateCertificatePDF = async (
  template: any,
  certificateData: CertificateData
): Promise<string | null> => {
  try {
    // Replace placeholders in template content
    const populateTemplate = (content: string, data: CertificateData): string => {
      const placeholders = {
        '{{STUDENT_NAME}}': data.studentName,
        '{{COURSE_TITLE}}': data.courseTitle,
        '{{COURSE_DESCRIPTION}}': data.courseDescription || `A comprehensive course in ${data.courseCategory}`,
        '{{COMPLETION_DATE}}': data.completionDate,
        '{{INSTRUCTOR_NAME}}': data.instructorName,
        '{{COURSE_CATEGORY}}': data.courseCategory,
        '{{VERIFICATION_CODE}}': data.verificationCode,
        '{{PLATFORM_NAME}}': data.platformName || 'SKILL BHARAT',
        '{{PLATFORM_TAGLINE}}': data.platformTagline || 'Empowering Skills, Building Futures'
      };

      let populatedContent = content;
      Object.entries(placeholders).forEach(([placeholder, value]) => {
        populatedContent = populatedContent.replace(new RegExp(placeholder, 'g'), value);
      });

      return populatedContent;
    };

    // Get populated template content
    const populatedContent = populateTemplate(template.template_content, certificateData);

    // Create complete HTML document with styles
    const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificate of Completion - ${certificateData.studentName}</title>
        <style>
          ${template.template_styles || ''}

          /* Additional print styles */
          @media print {
            body { margin: 0; }
            .certificate-container {
              page-break-inside: avoid;
              box-shadow: none !important;
            }
          }

          /* Ensure proper rendering */
          body {
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
        </style>
      </head>
      <body>
        ${populatedContent}
      </body>
      </html>
    `;

    // Convert HTML to PDF (in a real application, you'd use a service like Puppeteer or a PDF API)
    // For now, we'll create a data URL that can be used to display the certificate
    const blob = new Blob([certificateHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    return url;
  } catch (error) {
    console.error('Error generating certificate PDF:', error);
    return null;
  }
};
