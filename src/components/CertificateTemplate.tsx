import React from 'react';

export interface CertificateData {
  studentName: string;
  courseTitle: string;
  courseDescription: string;
  completionDate: string;
  instructorName: string;
  courseCategory: string;
  verificationCode: string;
  platformName: string;
  platformTagline: string;
}

interface CertificateTemplateProps {
  templateContent: string;
  templateStyles: string;
  certificateData: CertificateData;
  className?: string;
}

export const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  templateContent,
  templateStyles,
  certificateData,
  className = ''
}) => {
  // Replace template variables with actual data
  const populateTemplate = (content: string, data: CertificateData): string => {
    return content
      .replace(/\{\{studentName\}\}/g, data.studentName)
      .replace(/\{\{courseTitle\}\}/g, data.courseTitle)
      .replace(/\{\{courseDescription\}\}/g, data.courseDescription)
      .replace(/\{\{completionDate\}\}/g, data.completionDate)
      .replace(/\{\{instructorName\}\}/g, data.instructorName)
      .replace(/\{\{courseCategory\}\}/g, data.courseCategory)
      .replace(/\{\{verificationCode\}\}/g, data.verificationCode)
      .replace(/\{\{platformName\}\}/g, data.platformName)
      .replace(/\{\{platformTagline\}\}/g, data.platformTagline);
  };

  const populatedContent = populateTemplate(templateContent, certificateData);

  return (
    <div className={`certificate-wrapper ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: templateStyles }} />
      <div dangerouslySetInnerHTML={{ __html: populatedContent }} />
    </div>
  );
};
