import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  Copy,
  Save,
  X,
  FileText,
  Image,
  FileDown
} from 'lucide-react';
import { useCertificateTemplates, CertificateTemplate } from '@/hooks/useCertificateTemplates';
import { CertificateTemplate as CertificateTemplateComponent, CertificateData } from '@/components/CertificateTemplate';
import { useToast } from '@/hooks/use-toast';

interface CertificateTemplateManagerProps {
  onTemplateSelect?: (template: CertificateTemplate) => void;
  selectedTemplateId?: string;
  className?: string;
}

export const CertificateTemplateManager: React.FC<CertificateTemplateManagerProps> = ({
  onTemplateSelect,
  selectedTemplateId,
  className = ''
}) => {
  const { 
    templates, 
    loading, 
    createTemplate, 
    updateTemplate, 
    deleteTemplate, 
    setDefaultTemplate 
  } = useCertificateTemplates();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CertificateTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<CertificateTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template_type: 'html' as 'html' | 'image' | 'pdf',
    template_content: '',
    template_styles: ''
  });
  
  const { toast } = useToast();

  const sampleCertificateData: CertificateData = {
    studentName: 'John Doe',
    courseTitle: 'Sample Course Title',
    courseDescription: 'A comprehensive course in web development',
    completionDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    instructorName: 'Jane Smith',
    courseCategory: 'Technology',
    verificationCode: 'ABC123DEF456',
    platformName: 'SKILL BHARAT',
    platformTagline: 'Empowering Skills, Building Futures'
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingTemplate(null);
    setFormData({
      name: '',
      description: '',
      template_type: 'html',
      template_content: '',
      template_styles: ''
    });
  };

  const handleEdit = (template: CertificateTemplate) => {
    setEditingTemplate(template);
    setIsCreating(false);
    setFormData({
      name: template.name,
      description: template.description || '',
      template_type: template.template_type,
      template_content: template.template_content,
      template_styles: template.template_styles || ''
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.template_content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, formData);
      } else {
        await createTemplate(formData);
      }
      
      setIsCreating(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingTemplate(null);
  };

  const handleDelete = async (template: CertificateTemplate) => {
    if (window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
      await deleteTemplate(template.id);
    }
  };

  const handleSetDefault = async (template: CertificateTemplate) => {
    await setDefaultTemplate(template.id);
  };

  const handleDuplicate = (template: CertificateTemplate) => {
    setIsCreating(true);
    setEditingTemplate(null);
    setFormData({
      name: `${template.name} (Copy)`,
      description: template.description || '',
      template_type: template.template_type,
      template_content: template.template_content,
      template_styles: template.template_styles || ''
    });
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'html': return <FileText className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'pdf': return <FileDown className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card className={`bg-black/40 backdrop-blur-xl border border-white/10 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            <span className="ml-2 text-white">Loading templates...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`certificate-template-manager space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Certificate Templates</CardTitle>
            <Button
              onClick={handleCreateNew}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Create/Edit Form */}
      {(isCreating || editingTemplate) && (
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white">Template Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <Label htmlFor="type" className="text-white">Template Type</Label>
                <select
                  id="type"
                  value={formData.template_type}
                  onChange={(e) => setFormData({ ...formData, template_type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                >
                  <option value="html">HTML Template</option>
                  <option value="image">Image Template</option>
                  <option value="pdf">PDF Template</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter template description"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-white">Template Content *</Label>
              <Textarea
                id="content"
                value={formData.template_content}
                onChange={(e) => setFormData({ ...formData, template_content: e.target.value })}
                className="bg-white/10 border-white/20 text-white font-mono text-sm"
                placeholder="Enter HTML template content with placeholders like {{STUDENT_NAME}}"
                rows={8}
              />
            </div>

            {formData.template_type === 'html' && (
              <div>
                <Label htmlFor="styles" className="text-white">CSS Styles</Label>
                <Textarea
                  id="styles"
                  value={formData.template_styles}
                  onChange={(e) => setFormData({ ...formData, template_styles: e.target.value })}
                  className="bg-white/10 border-white/20 text-white font-mono text-sm"
                  placeholder="Enter CSS styles for the template"
                  rows={6}
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              {formData.template_content && formData.template_type === 'html' && (
                <Button
                  onClick={() => setPreviewTemplate({
                    id: 'preview',
                    name: formData.name || 'Preview',
                    description: formData.description,
                    template_type: formData.template_type,
                    template_content: formData.template_content,
                    template_styles: formData.template_styles,
                    is_default: false,
                    is_active: true,
                    preview_image_url: null,
                    created_at: '',
                    updated_at: '',
                    created_by: null
                  })}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className={`bg-black/40 backdrop-blur-xl border border-white/10 cursor-pointer transition-all hover:border-white/30 ${
              selectedTemplateId === template.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onTemplateSelect?.(template)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTemplateIcon(template.template_type)}
                  <CardTitle className="text-white text-sm">{template.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  {template.is_default && (
                    <Badge className="bg-yellow-500/20 text-yellow-300">
                      <Star className="w-3 h-3 mr-1" />
                      Default
                    </Badge>
                  )}
                </div>
              </div>
              {template.description && (
                <p className="text-white/60 text-xs">{template.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(template);
                  }}
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Eye className="w-3 h-3" />
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(template);
                  }}
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicate(template);
                  }}
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                {!template.is_default && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefault(template);
                    }}
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Star className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(template);
                  }}
                  size="sm"
                  variant="outline"
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Template Preview: {previewTemplate.name}</h3>
              <Button
                onClick={() => setPreviewTemplate(null)}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6">
              {previewTemplate.template_type === 'html' ? (
                <CertificateTemplateComponent
                  templateContent={previewTemplate.template_content}
                  templateStyles={previewTemplate.template_styles || ''}
                  certificateData={sampleCertificateData}
                  className="transform scale-75 origin-top"
                />
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Preview not available for {previewTemplate.template_type} templates
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
