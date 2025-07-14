import { supabase } from '@/integrations/supabase/client';

export interface CertificateData {
  courseId: string;
  courseTitle: string;
  studentName: string;
  completionDate: string;
  instructor?: string;
  category?: string;
  totalLessons: number;
  timeSpent: number;
  verificationCode: string;
}

export interface CertificateGeneration {
  id: string;
  user_id: string;
  course_id: string;
  certificate_data: CertificateData;
  certificate_url?: string;
  verification_code: string;
  generated_at: string;
  downloaded_at?: string;
  download_count: number;
  is_valid: boolean;
}

export class CertificateService {
  /**
   * Generate a unique verification code for the certificate
   */
  private static generateVerificationCode(courseId: string, userId: string): string {
    const timestamp = Date.now().toString(36);
    const coursePrefix = courseId.slice(0, 8).toUpperCase();
    const userPrefix = userId.slice(0, 4).toUpperCase();
    return `CERT-${coursePrefix}-${userPrefix}-${timestamp}`;
  }

  /**
   * Check if a certificate already exists for the user and course
   */
  static async checkExistingCertificate(userId: string, courseId: string): Promise<CertificateGeneration | null> {
    try {
      const { data, error } = await supabase
        .from('certificate_generations')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('is_valid', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking existing certificate:', error);
      return null;
    }
  }

  /**
   * Generate a new certificate for the user
   */
  static async generateCertificate(
    userId: string,
    certificateData: CertificateData
  ): Promise<{ success: boolean; certificate?: CertificateGeneration; error?: string }> {
    try {
      // Check if certificate already exists
      const existingCertificate = await this.checkExistingCertificate(userId, certificateData.courseId);
      if (existingCertificate) {
        return {
          success: true,
          certificate: existingCertificate
        };
      }

      // Generate verification code
      const verificationCode = this.generateVerificationCode(certificateData.courseId, userId);

      // Create certificate generation record
      const { data, error } = await supabase
        .from('certificate_generations')
        .insert({
          user_id: userId,
          course_id: certificateData.courseId,
          certificate_data: certificateData,
          verification_code: verificationCode,
          generated_at: new Date().toISOString(),
          download_count: 0,
          is_valid: true
        })
        .select()
        .single();

      if (error) throw error;

      // Also create a record in the certificates table for backward compatibility
      await supabase
        .from('certificates')
        .insert({
          user_id: userId,
          course_id: certificateData.courseId,
          certificate_name: `Certificate of Completion - ${certificateData.courseTitle}`,
          issued_date: new Date().toISOString(),
          verification_code: verificationCode
        });

      return {
        success: true,
        certificate: data
      };
    } catch (error: any) {
      console.error('Error generating certificate:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate certificate'
      };
    }
  }

  /**
   * Record a certificate download
   */
  static async recordDownload(certificateId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('certificate_generations')
        .update({
          downloaded_at: new Date().toISOString(),
          download_count: supabase.sql`download_count + 1`
        })
        .eq('id', certificateId);

      if (error) throw error;
    } catch (error) {
      console.error('Error recording certificate download:', error);
    }
  }

  /**
   * Get all certificates for a user
   */
  static async getUserCertificates(userId: string): Promise<CertificateGeneration[]> {
    try {
      const { data, error } = await supabase
        .from('certificate_generations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_valid', true)
        .order('generated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user certificates:', error);
      return [];
    }
  }

  /**
   * Verify a certificate by verification code
   */
  static async verifyCertificate(verificationCode: string): Promise<{
    valid: boolean;
    certificate?: CertificateGeneration;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('certificate_generations')
        .select('*')
        .eq('verification_code', verificationCode)
        .eq('is_valid', true)
        .maybeSingle();

      if (error) throw error;

      return {
        valid: !!data,
        certificate: data || undefined
      };
    } catch (error: any) {
      console.error('Error verifying certificate:', error);
      return {
        valid: false,
        error: error.message || 'Failed to verify certificate'
      };
    }
  }

  /**
   * Generate a professional certificate design matching the reference
   */
  static async generatePDF(certificateData: CertificateData): Promise<Blob> {
    const certificateHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate of Completion</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .certificate-container {
            width: 1000px;
            height: 700px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            padding: 3px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }

          .certificate-inner {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 17px;
            padding: 60px;
            position: relative;
            overflow: hidden;
          }

          .certificate-inner::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            pointer-events: none;
          }

          .header {
            text-align: center;
            margin-bottom: 40px;
            position: relative;
            z-index: 2;
          }

          .brand-name {
            font-family: 'Playfair Display', serif;
            font-size: 48px;
            font-weight: 700;
            color: #FFD700;
            letter-spacing: 3px;
            margin-bottom: 8px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          }

          .tagline {
            font-size: 18px;
            color: rgba(255, 255, 255, 0.9);
            font-style: italic;
            font-weight: 300;
            letter-spacing: 1px;
          }

          .certificate-title {
            font-family: 'Playfair Display', serif;
            font-size: 36px;
            color: white;
            text-align: center;
            margin: 40px 0 30px 0;
            font-weight: 400;
            letter-spacing: 2px;
          }

          .certification-text {
            text-align: center;
            color: rgba(255, 255, 255, 0.9);
            font-size: 18px;
            margin-bottom: 20px;
            font-weight: 300;
          }

          .student-name {
            font-family: 'Playfair Display', serif;
            font-size: 42px;
            color: #FFD700;
            text-align: center;
            margin: 30px 0;
            font-weight: 700;
            letter-spacing: 2px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          }

          .completion-text {
            text-align: center;
            color: rgba(255, 255, 255, 0.9);
            font-size: 18px;
            margin-bottom: 15px;
            font-weight: 300;
          }

          .course-title {
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            color: white;
            text-align: center;
            margin: 20px 0;
            font-weight: 600;
            letter-spacing: 1px;
          }

          .course-description {
            text-align: center;
            color: rgba(255, 255, 255, 0.8);
            font-size: 16px;
            font-style: italic;
            margin-bottom: 40px;
            font-weight: 300;
          }

          .details-section {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
            position: relative;
            z-index: 2;
          }

          .detail-item {
            text-align: center;
            flex: 1;
          }

          .detail-label {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }

          .detail-value {
            color: #FFD700;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 0.5px;
          }

          .verification-section {
            position: absolute;
            bottom: 40px;
            left: 60px;
            right: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .verification-code {
            color: rgba(255, 255, 255, 0.6);
            font-size: 12px;
            font-weight: 400;
          }

          .verification-url {
            color: rgba(255, 255, 255, 0.6);
            font-size: 12px;
            font-weight: 400;
          }

          .signature {
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
            font-style: italic;
            font-weight: 300;
          }

          .decorative-elements {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            opacity: 0.1;
          }

          .decorative-elements::before,
          .decorative-elements::after {
            content: '';
            position: absolute;
            width: 100px;
            height: 100px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
          }

          .decorative-elements::before {
            top: 50px;
            left: 50px;
          }

          .decorative-elements::after {
            bottom: 50px;
            right: 50px;
          }

          @media print {
            body {
              background: white;
            }
            .certificate-container {
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          <div class="certificate-inner">
            <div class="decorative-elements"></div>

            <div class="header">
              <div class="brand-name">SKILL BHARAT</div>
              <div class="tagline">Empowering Skills, Building Futures</div>
            </div>

            <div class="certificate-title">Certificate of Completion</div>

            <div class="certification-text">This is to certify that</div>

            <div class="student-name">${certificateData.studentName}</div>

            <div class="completion-text">has successfully completed the course</div>

            <div class="course-title">${certificateData.courseTitle}</div>

            <div class="course-description">A comprehensive course on ${certificateData.category || 'skill development'}</div>

            <div class="details-section">
              <div class="detail-item">
                <div class="detail-label">Completion Date:</div>
                <div class="detail-value">${new Date(certificateData.completionDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</div>
              </div>

              <div class="detail-item">
                <div class="detail-label">Instructor:</div>
                <div class="detail-value">${certificateData.instructor || 'Skill Bharat Team'}</div>
              </div>

              <div class="detail-item">
                <div class="detail-label">Category:</div>
                <div class="detail-value">${certificateData.category || 'General'}</div>
              </div>
            </div>

            <div class="verification-section">
              <div>
                <div class="verification-code">Verification Code: ${certificateData.verificationCode}</div>
                <div class="verification-url">Verify at: skillbharat.com/verify</div>
              </div>
              <div class="signature">Authorized Signature</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Convert HTML to blob
    const blob = new Blob([certificateHTML], { type: 'text/html' });
    return blob;
  }

  /**
   * Download certificate as PDF
   */
  static async downloadCertificate(certificate: CertificateGeneration): Promise<void> {
    try {
      // Generate PDF
      const pdfBlob = await this.generatePDF(certificate.certificate_data);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificate-${certificate.certificate_data.courseTitle.replace(/[^a-zA-Z0-9]/g, '-')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Record the download
      await this.recordDownload(certificate.id);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      throw error;
    }
  }
}
