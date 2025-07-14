import jsPDF from 'jspdf';
import { ResumeAnalysis, JobMatch, InterviewQuestion } from '@/hooks/useJobSearchAgent';

class PDFExportService {
  private addHeader(doc: jsPDF, title: string) {
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text(title, 20, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 40);
    
    // Add a line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 45, 190, 45);
    
    return 55; // Return Y position for next content
  }

  private addSection(doc: jsPDF, title: string, yPos: number): number {
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text(title, 20, yPos);
    return yPos + 10;
  }

  private addText(doc: jsPDF, text: string, yPos: number, fontSize: number = 10): number {
    doc.setFontSize(fontSize);
    doc.setTextColor(60, 60, 60);
    
    // Split text into lines that fit the page width
    const lines = doc.splitTextToSize(text, 170);
    doc.text(lines, 20, yPos);
    
    return yPos + (lines.length * (fontSize * 0.5)) + 5;
  }

  private addBulletPoint(doc: jsPDF, text: string, yPos: number): number {
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text('•', 25, yPos);
    
    const lines = doc.splitTextToSize(text, 160);
    doc.text(lines, 30, yPos);
    
    return yPos + (lines.length * 5) + 3;
  }

  private checkPageBreak(doc: jsPDF, yPos: number, requiredSpace: number = 20): number {
    if (yPos + requiredSpace > 280) {
      doc.addPage();
      return 20;
    }
    return yPos;
  }

  /**
   * Export resume analysis to PDF
   */
  exportResumeAnalysis(analysis: ResumeAnalysis, filename: string = 'resume-analysis.pdf') {
    const doc = new jsPDF();
    let yPos = this.addHeader(doc, 'Resume Analysis Report');

    // Overall Score
    yPos = this.checkPageBreak(doc, yPos);
    yPos = this.addSection(doc, 'Overall Assessment', yPos);
    yPos = this.addText(doc, `Match Score: ${analysis.matchPercentage || 'N/A'}%`, yPos, 12);
    yPos += 5;

    // Skills
    if (analysis.skills.length > 0) {
      yPos = this.checkPageBreak(doc, yPos);
      yPos = this.addSection(doc, 'Detected Skills', yPos);
      analysis.skills.forEach(skill => {
        yPos = this.addBulletPoint(doc, skill, yPos);
      });
      yPos += 5;
    }

    // Strengths
    if (analysis.strengths && analysis.strengths.length > 0) {
      yPos = this.checkPageBreak(doc, yPos);
      yPos = this.addSection(doc, 'Key Strengths', yPos);
      analysis.strengths.forEach(strength => {
        yPos = this.addBulletPoint(doc, strength, yPos);
      });
      yPos += 5;
    }

    // Areas for Improvement
    if (analysis.improvements && analysis.improvements.length > 0) {
      yPos = this.checkPageBreak(doc, yPos);
      yPos = this.addSection(doc, 'Areas for Improvement', yPos);
      analysis.improvements.forEach(improvement => {
        yPos = this.addBulletPoint(doc, improvement, yPos);
      });
      yPos += 5;
    }

    // Missing Skills
    if (analysis.missingSkills && analysis.missingSkills.length > 0) {
      yPos = this.checkPageBreak(doc, yPos);
      yPos = this.addSection(doc, 'Missing Skills', yPos);
      analysis.missingSkills.forEach(skill => {
        yPos = this.addBulletPoint(doc, skill, yPos);
      });
      yPos += 5;
    }

    // Experience
    if (analysis.experience.length > 0) {
      yPos = this.checkPageBreak(doc, yPos);
      yPos = this.addSection(doc, 'Experience Analysis', yPos);
      analysis.experience.forEach(exp => {
        yPos = this.addBulletPoint(doc, exp, yPos);
      });
      yPos += 5;
    }

    // Education
    if (analysis.education.length > 0) {
      yPos = this.checkPageBreak(doc, yPos);
      yPos = this.addSection(doc, 'Education Background', yPos);
      analysis.education.forEach(edu => {
        yPos = this.addBulletPoint(doc, edu, yPos);
      });
      yPos += 5;
    }

    // Full Analysis
    if (analysis.text) {
      yPos = this.checkPageBreak(doc, yPos, 50);
      yPos = this.addSection(doc, 'Detailed Analysis', yPos);
      yPos = this.addText(doc, analysis.text, yPos);
    }

    doc.save(filename);
  }

  /**
   * Export job matches to PDF
   */
  exportJobMatches(jobs: JobMatch[], filename: string = 'job-matches.pdf') {
    const doc = new jsPDF();
    let yPos = this.addHeader(doc, 'Job Matches Report');

    yPos = this.addText(doc, `Found ${jobs.length} job opportunities`, yPos, 12);
    yPos += 10;

    jobs.forEach((job, index) => {
      yPos = this.checkPageBreak(doc, yPos, 60);
      
      // Job title and company
      yPos = this.addSection(doc, `${index + 1}. ${job.title}`, yPos);
      yPos = this.addText(doc, `Company: ${job.company}`, yPos, 11);
      yPos = this.addText(doc, `Location: ${job.location}`, yPos, 11);
      
      if (job.matchScore) {
        yPos = this.addText(doc, `Match Score: ${job.matchScore}%`, yPos, 11);
      }
      
      if (job.salaryRange) {
        yPos = this.addText(doc, `Salary: ${job.salaryRange}`, yPos, 11);
      }
      
      if (job.jobType) {
        yPos = this.addText(doc, `Type: ${job.jobType}`, yPos, 11);
      }

      // Description
      if (job.description) {
        yPos += 5;
        yPos = this.addText(doc, 'Description:', yPos, 11);
        yPos = this.addText(doc, job.description, yPos);
      }

      // Requirements
      if (job.requirements.length > 0) {
        yPos += 5;
        yPos = this.addText(doc, 'Requirements:', yPos, 11);
        job.requirements.forEach(req => {
          yPos = this.addBulletPoint(doc, req, yPos);
        });
      }

      // Key Matches
      if (job.keyMatches && job.keyMatches.length > 0) {
        yPos += 5;
        yPos = this.addText(doc, 'Why you\'re a good match:', yPos, 11);
        job.keyMatches.forEach(match => {
          yPos = this.addBulletPoint(doc, match, yPos);
        });
      }

      // Required Skills
      if (job.requiredSkills && job.requiredSkills.length > 0) {
        yPos += 5;
        yPos = this.addText(doc, `Required Skills: ${job.requiredSkills.join(', ')}`, yPos);
      }

      if (job.url) {
        yPos += 5;
        yPos = this.addText(doc, `Apply at: ${job.url}`, yPos, 9);
      }

      yPos += 15; // Space between jobs
    });

    doc.save(filename);
  }

  /**
   * Export interview questions to PDF
   */
  exportInterviewQuestions(questions: InterviewQuestion[], jobTitle: string = '', filename: string = 'interview-questions.pdf') {
    const doc = new jsPDF();
    let yPos = this.addHeader(doc, 'Interview Preparation Guide');

    if (jobTitle) {
      yPos = this.addText(doc, `Prepared for: ${jobTitle}`, yPos, 12);
      yPos += 10;
    }

    questions.forEach((question, index) => {
      yPos = this.checkPageBreak(doc, yPos, 80);
      
      // Question number and text
      yPos = this.addSection(doc, `Question ${index + 1}`, yPos);
      yPos = this.addText(doc, question.question, yPos, 11);
      
      // Type and difficulty
      yPos += 5;
      yPos = this.addText(doc, `Type: ${question.type} | Difficulty: ${question.difficulty}`, yPos, 9);
      
      // Reasoning
      if (question.reasoning) {
        yPos += 5;
        yPos = this.addText(doc, 'Why this question:', yPos, 10);
        yPos = this.addText(doc, question.reasoning, yPos);
      }

      // Sample Answer
      if (question.sampleAnswer) {
        yPos += 5;
        yPos = this.addText(doc, 'Sample Answer:', yPos, 10);
        yPos = this.addText(doc, question.sampleAnswer, yPos);
      }

      // Tips
      if (question.tips && question.tips.length > 0) {
        yPos += 5;
        yPos = this.addText(doc, 'Tips for answering:', yPos, 10);
        question.tips.forEach(tip => {
          yPos = this.addBulletPoint(doc, tip, yPos);
        });
      }

      yPos += 15; // Space between questions
    });

    doc.save(filename);
  }

  /**
   * Export comprehensive report with all data
   */
  exportComprehensiveReport(
    analysis: ResumeAnalysis,
    jobs: JobMatch[],
    questions: InterviewQuestion[],
    filename: string = 'comprehensive-job-search-report.pdf'
  ) {
    const doc = new jsPDF();
    let yPos = this.addHeader(doc, 'Comprehensive Job Search Report');

    // Table of Contents
    yPos = this.addSection(doc, 'Table of Contents', yPos);
    yPos = this.addBulletPoint(doc, '1. Resume Analysis', yPos);
    yPos = this.addBulletPoint(doc, '2. Job Matches', yPos);
    yPos = this.addBulletPoint(doc, '3. Interview Preparation', yPos);
    yPos += 20;

    // Resume Analysis Section
    doc.addPage();
    yPos = this.addHeader(doc, '1. Resume Analysis');
    // Add resume analysis content (simplified version)
    yPos = this.addText(doc, `Overall Match Score: ${analysis.matchPercentage || 'N/A'}%`, yPos, 12);
    yPos = this.addText(doc, `Skills Found: ${analysis.skills.length}`, yPos);
    yPos = this.addText(doc, `Strengths Identified: ${analysis.strengths?.length || 0}`, yPos);
    yPos = this.addText(doc, `Areas for Improvement: ${analysis.improvements?.length || 0}`, yPos);

    // Job Matches Section
    doc.addPage();
    yPos = this.addHeader(doc, '2. Job Matches Summary');
    yPos = this.addText(doc, `Total Jobs Found: ${jobs.length}`, yPos, 12);
    
    const highMatchJobs = jobs.filter(job => (job.matchScore || 0) >= 80);
    yPos = this.addText(doc, `High Match Jobs (80%+): ${highMatchJobs.length}`, yPos);

    // Interview Questions Section
    doc.addPage();
    yPos = this.addHeader(doc, '3. Interview Preparation Summary');
    yPos = this.addText(doc, `Total Questions Generated: ${questions.length}`, yPos, 12);
    
    const technicalQuestions = questions.filter(q => q.type === 'technical');
    const behavioralQuestions = questions.filter(q => q.type === 'behavioral');
    const roleSpecificQuestions = questions.filter(q => q.type === 'role-specific');
    
    yPos = this.addText(doc, `Technical Questions: ${technicalQuestions.length}`, yPos);
    yPos = this.addText(doc, `Behavioral Questions: ${behavioralQuestions.length}`, yPos);
    yPos = this.addText(doc, `Role-Specific Questions: ${roleSpecificQuestions.length}`, yPos);

    doc.save(filename);
  }
}

export const pdfExportService = new PDFExportService();
