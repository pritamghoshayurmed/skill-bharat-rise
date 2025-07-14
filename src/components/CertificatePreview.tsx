import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, Eye } from "lucide-react";
import { CertificateData, CertificateService } from '@/lib/certificateService';

interface CertificatePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  certificateData: CertificateData;
  onDownload?: () => void;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  isOpen,
  onClose,
  certificateData,
  onDownload
}) => {
  const handleDownload = async () => {
    try {
      const pdfBlob = await CertificateService.generatePDF(certificateData);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificate-${certificateData.courseTitle.replace(/[^a-zA-Z0-9]/g, '-')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Certificate of Completion - ${certificateData.courseTitle}`,
        text: `I've completed ${certificateData.courseTitle} on Skill Bharat!`,
        url: `https://skillbharat.com/verify/${certificateData.verificationCode}`
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `I've completed ${certificateData.courseTitle} on Skill Bharat! Verify at: https://skillbharat.com/verify/${certificateData.verificationCode}`
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-black/95 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Certificate Preview
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Certificate Preview */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-8 overflow-hidden">
            <div className="certificate-container mx-auto" style={{ 
              width: '800px', 
              height: '560px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              padding: '3px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '13px',
                padding: '48px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Border decoration */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  right: '16px',
                  bottom: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  pointerEvents: 'none'
                }} />
                
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 2 }}>
                  <div style={{
                    fontFamily: 'serif',
                    fontSize: '38px',
                    fontWeight: '700',
                    color: '#FFD700',
                    letterSpacing: '2px',
                    marginBottom: '6px',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
                  }}>
                    SKILL BHARAT
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontStyle: 'italic',
                    fontWeight: '300',
                    letterSpacing: '1px'
                  }}>
                    Empowering Skills, Building Futures
                  </div>
                </div>
                
                {/* Certificate Title */}
                <div style={{
                  fontFamily: 'serif',
                  fontSize: '28px',
                  color: 'white',
                  textAlign: 'center',
                  margin: '32px 0 24px 0',
                  fontWeight: '400',
                  letterSpacing: '1.5px'
                }}>
                  Certificate of Completion
                </div>
                
                {/* Certification Text */}
                <div style={{
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  marginBottom: '16px',
                  fontWeight: '300'
                }}>
                  This is to certify that
                </div>
                
                {/* Student Name */}
                <div style={{
                  fontFamily: 'serif',
                  fontSize: '32px',
                  color: '#FFD700',
                  textAlign: 'center',
                  margin: '24px 0',
                  fontWeight: '700',
                  letterSpacing: '1.5px',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
                }}>
                  {certificateData.studentName}
                </div>
                
                {/* Completion Text */}
                <div style={{
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  marginBottom: '12px',
                  fontWeight: '300'
                }}>
                  has successfully completed the course
                </div>
                
                {/* Course Title */}
                <div style={{
                  fontFamily: 'serif',
                  fontSize: '24px',
                  color: 'white',
                  textAlign: 'center',
                  margin: '16px 0',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}>
                  {certificateData.courseTitle}
                </div>
                
                {/* Course Description */}
                <div style={{
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '12px',
                  fontStyle: 'italic',
                  marginBottom: '32px',
                  fontWeight: '300'
                }}>
                  A comprehensive course on {certificateData.category || 'skill development'}
                </div>
                
                {/* Details Section */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '40px',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '11px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '6px'
                    }}>
                      Completion Date:
                    </div>
                    <div style={{
                      color: '#FFD700',
                      fontSize: '12px',
                      fontWeight: '600',
                      letterSpacing: '0.3px'
                    }}>
                      {new Date(certificateData.completionDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '11px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '6px'
                    }}>
                      Instructor:
                    </div>
                    <div style={{
                      color: '#FFD700',
                      fontSize: '12px',
                      fontWeight: '600',
                      letterSpacing: '0.3px'
                    }}>
                      {certificateData.instructor || 'Skill Bharat Team'}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '11px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '6px'
                    }}>
                      Category:
                    </div>
                    <div style={{
                      color: '#FFD700',
                      fontSize: '12px',
                      fontWeight: '600',
                      letterSpacing: '0.3px'
                    }}>
                      {certificateData.category || 'General'}
                    </div>
                  </div>
                </div>
                
                {/* Verification Section */}
                <div style={{
                  position: 'absolute',
                  bottom: '32px',
                  left: '48px',
                  right: '48px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '10px',
                      fontWeight: '400'
                    }}>
                      Verification Code: {certificateData.verificationCode}
                    </div>
                    <div style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '10px',
                      fontWeight: '400'
                    }}>
                      Verify at: skillbharat.com/verify
                    </div>
                  </div>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '11px',
                    fontStyle: 'italic',
                    fontWeight: '300'
                  }}>
                    Authorized Signature
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button onClick={handleDownload} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
              <Download className="w-4 h-4 mr-2" />
              Download Certificate
            </Button>
            <Button onClick={handleShare} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Share2 className="w-4 h-4 mr-2" />
              Share Achievement
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
