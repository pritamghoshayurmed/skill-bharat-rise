import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CertificateTemplate {
  id: string;
  name: string;
  description: string | null;
  template_type: 'html' | 'image' | 'pdf';
  template_content: string;
  template_styles: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateData {
  name: string;
  description?: string;
  template_type: 'html' | 'image' | 'pdf';
  template_content: string;
  template_styles?: string;
}

export const useCertificateTemplates = () => {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTemplates = async () => {
    try {
      // For now, return a default template since the table might not exist
      const defaultTemplate: CertificateTemplate = {
        id: 'default-template',
        name: 'Default Certificate',
        description: 'Default certificate template',
        template_type: 'html',
        template_content: `
          <div class="certificate-container">
            <h1>Certificate of Completion</h1>
            <p>This is to certify that</p>
            <h2>{{studentName}}</h2>
            <p>has successfully completed the course</p>
            <h3>{{courseTitle}}</h3>
            <p>on {{completionDate}}</p>
            <p>Instructor: {{instructorName}}</p>
            <p>Verification Code: {{verificationCode}}</p>
          </div>
        `,
        template_styles: `
          .certificate-container {
            text-align: center;
            padding: 40px;
            border: 2px solid #333;
            font-family: Arial, sans-serif;
          }
          h1 { color: #333; margin-bottom: 20px; }
          h2 { color: #0066cc; margin: 20px 0; }
          h3 { color: #333; margin: 20px 0; }
          p { margin: 10px 0; }
        `,
        is_default: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setTemplates([defaultTemplate]);
    } catch (error: any) {
      console.error('Error fetching certificate templates:', error);
      toast({
        title: "Error",
        description: "Failed to load certificate templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (templateData: CreateTemplateData) => {
    try {
      // For now, just add to local state since table might not exist
      const newTemplate: CertificateTemplate = {
        id: `template-${Date.now()}`,
        ...templateData,
        description: templateData.description || null,
        template_styles: templateData.template_styles || null,
        is_default: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setTemplates(prev => [...prev, newTemplate]);
      
      toast({
        title: "Template Created",
        description: "Certificate template created successfully",
      });

      return newTemplate;
    } catch (error: any) {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: "Failed to create certificate template",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateTemplate = async (templateId: string, templateData: Partial<CreateTemplateData>) => {
    try {
      setTemplates(prev => prev.map(template => 
        template.id === templateId 
          ? { ...template, ...templateData, updated_at: new Date().toISOString() }
          : template
      ));

      toast({
        title: "Template Updated",
        description: "Certificate template updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating template:', error);
      toast({
        title: "Error",
        description: "Failed to update certificate template",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      setTemplates(prev => prev.filter(template => template.id !== templateId));

      toast({
        title: "Template Deleted",
        description: "Certificate template deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete certificate template",
        variant: "destructive"
      });
      throw error;
    }
  };

  const setDefaultTemplate = async (templateId: string) => {
    try {
      setTemplates(prev => prev.map(template => ({
        ...template,
        is_default: template.id === templateId
      })));

      toast({
        title: "Default Template Set",
        description: "Default certificate template updated",
      });
    } catch (error: any) {
      console.error('Error setting default template:', error);
      toast({
        title: "Error",
        description: "Failed to set default template",
        variant: "destructive"
      });
      throw error;
    }
  };

  const getTemplateForCourse = async (courseId: string): Promise<CertificateTemplate | null> => {
    // Return the default template for now
    const defaultTemplate = templates.find(t => t.is_default);
    return defaultTemplate || templates[0] || null;
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    setDefaultTemplate,
    getTemplateForCourse,
    refetch: fetchTemplates
  };
};
