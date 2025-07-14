import jsPDF from 'jspdf';
import { InterviewQuestionsSet, InterviewQuestion } from './interviewQuestionsService';

class InterviewQuestionsPdfExport {
  private doc: jsPDF;
  private pageHeight: number;
  private pageWidth: number;
  private currentY: number;
  private margin: number;
  private lineHeight: number;

  constructor() {
    this.doc = new jsPDF();
    this.pageHeight = this.doc.internal.pageSize.height;
    this.pageWidth = this.doc.internal.pageSize.width;
    this.currentY = 20;
    this.margin = 20;
    this.lineHeight = 7;
  }

  /**
   * Export interview questions set to PDF
   */
  async exportToPdf(questionsSet: InterviewQuestionsSet): Promise<void> {
    this.doc = new jsPDF();
    this.currentY = 20;

    // Add header
    this.addHeader(questionsSet);
    
    // Add job information
    this.addJobInformation(questionsSet);
    
    // Add questions by category
    this.addQuestionsByCategory(questionsSet);
    
    // Add footer
    this.addFooter();
    
    // Save the PDF
    const fileName = `Interview_Questions_${questionsSet.jobTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    this.doc.save(fileName);
  }

  private addHeader(questionsSet: InterviewQuestionsSet): void {
    // Title
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Interview Questions', this.margin, this.currentY);
    this.currentY += 15;

    // Job title
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Position: ${questionsSet.jobTitle}`, this.margin, this.currentY);
    this.currentY += 10;

    // Generation date
    this.doc.setFontSize(12);
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(`Generated on: ${new Date(questionsSet.generatedAt).toLocaleDateString()}`, this.margin, this.currentY);
    this.currentY += 5;

    // Total questions
    this.doc.text(`Total Questions: ${questionsSet.totalQuestions}`, this.margin, this.currentY);
    this.currentY += 15;

    // Reset color
    this.doc.setTextColor(0, 0, 0);
  }

  private addJobInformation(questionsSet: InterviewQuestionsSet): void {
    if (!questionsSet.jobDescription) return;

    this.checkPageBreak(30);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Job Description', this.margin, this.currentY);
    this.currentY += 10;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const descriptionLines = this.splitTextToLines(questionsSet.jobDescription, this.pageWidth - 2 * this.margin);
    descriptionLines.forEach(line => {
      this.checkPageBreak(this.lineHeight);
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    });
    
    this.currentY += 10;
  }

  private addQuestionsByCategory(questionsSet: InterviewQuestionsSet): void {
    const categories = ['behavioral', 'technical', 'coding', 'project-architecture', 'general'];
    
    categories.forEach(category => {
      const categoryQuestions = questionsSet.questions.filter(q => q.category === category);
      if (categoryQuestions.length === 0) return;

      this.addCategorySection(category, categoryQuestions);
    });
  }

  private addCategorySection(category: string, questions: InterviewQuestion[]): void {
    this.checkPageBreak(20);
    
    // Category header
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 100, 200);
    this.doc.text(`${category.charAt(0).toUpperCase() + category.slice(1)} Questions (${questions.length})`, this.margin, this.currentY);
    this.currentY += 15;
    
    this.doc.setTextColor(0, 0, 0);

    questions.forEach((question, index) => {
      this.addQuestion(question, index + 1);
    });
  }

  private addQuestion(question: InterviewQuestion, questionNumber: number): void {
    this.checkPageBreak(40);

    // Question number and text
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`Q${questionNumber}. ${question.question}`, this.margin, this.currentY);
    this.currentY += 10;

    // Question metadata
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(`Difficulty: ${question.difficulty} | Time: ${question.timeLimit} min`, this.margin, this.currentY);
    this.currentY += 8;

    // Context (if available)
    if (question.context) {
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFont('helvetica', 'italic');
      this.doc.text('Context:', this.margin, this.currentY);
      this.currentY += 6;
      
      const contextLines = this.splitTextToLines(question.context, this.pageWidth - 2 * this.margin - 10);
      contextLines.forEach(line => {
        this.checkPageBreak(this.lineHeight);
        this.doc.text(line, this.margin + 10, this.currentY);
        this.currentY += this.lineHeight;
      });
      this.currentY += 5;
    }

    // Sample answer
    if (question.sampleAnswer) {
      this.checkPageBreak(15);
      
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Sample Answer:', this.margin, this.currentY);
      this.currentY += 7;

      this.doc.setFont('helvetica', 'normal');
      const answerLines = this.splitTextToLines(question.sampleAnswer, this.pageWidth - 2 * this.margin - 10);
      answerLines.forEach(line => {
        this.checkPageBreak(this.lineHeight);
        this.doc.text(line, this.margin + 10, this.currentY);
        this.currentY += this.lineHeight;
      });
      this.currentY += 5;
    }

    // Tips
    if (question.tips && question.tips.length > 0) {
      this.checkPageBreak(15);
      
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Tips:', this.margin, this.currentY);
      this.currentY += 7;

      this.doc.setFont('helvetica', 'normal');
      question.tips.forEach(tip => {
        this.checkPageBreak(this.lineHeight);
        this.doc.text(`• ${tip}`, this.margin + 10, this.currentY);
        this.currentY += this.lineHeight;
      });
      this.currentY += 5;
    }

    // Add separator line
    this.checkPageBreak(10);
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 15;
  }

  private addFooter(): void {
    const totalPages = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setTextColor(100, 100, 100);
      this.doc.text(
        `Generated by Skill Bharat - Page ${i} of ${totalPages}`,
        this.pageWidth / 2,
        this.pageHeight - 10,
        { align: 'center' }
      );
    }
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.doc.addPage();
      this.currentY = 20;
    }
  }

  private splitTextToLines(text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = this.doc.getTextWidth(testLine);
      
      if (textWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  /**
   * Export questions with answers only (no tips or context)
   */
  async exportQuestionsOnly(questionsSet: InterviewQuestionsSet): Promise<void> {
    this.doc = new jsPDF();
    this.currentY = 20;

    // Add header
    this.addHeader(questionsSet);
    
    // Add questions without answers
    const categories = ['behavioral', 'technical', 'coding', 'project-architecture', 'general'];
    
    categories.forEach(category => {
      const categoryQuestions = questionsSet.questions.filter(q => q.category === category);
      if (categoryQuestions.length === 0) return;

      this.checkPageBreak(20);
      
      // Category header
      this.doc.setFontSize(16);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(0, 100, 200);
      this.doc.text(`${category.charAt(0).toUpperCase() + category.slice(1)} Questions`, this.margin, this.currentY);
      this.currentY += 15;
      
      this.doc.setTextColor(0, 0, 0);

      categoryQuestions.forEach((question, index) => {
        this.checkPageBreak(15);
        
        this.doc.setFontSize(12);
        this.doc.setFont('helvetica', 'normal');
        this.doc.text(`${index + 1}. ${question.question}`, this.margin, this.currentY);
        this.currentY += 10;
        
        // Add space for answer
        this.doc.setFontSize(9);
        this.doc.setTextColor(150, 150, 150);
        this.doc.text('Answer:', this.margin + 10, this.currentY);
        this.currentY += 20; // Space for handwritten answer
      });
      
      this.currentY += 10;
    });
    
    this.addFooter();
    
    const fileName = `Interview_Questions_Practice_${questionsSet.jobTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    this.doc.save(fileName);
  }
}

export const interviewQuestionsPdfExport = new InterviewQuestionsPdfExport();
