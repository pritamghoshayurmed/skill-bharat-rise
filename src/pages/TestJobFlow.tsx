import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { runJobPostingTests, testJobPosting } from '@/utils/testHelpers';

const TestJobFlow = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRunTests = async () => {
    setLoading(true);
    try {
      const results = await runJobPostingTests();
      setTestResults(results);
      
      toast({
        title: "Tests Completed",
        description: "Check the console for detailed results",
      });
    } catch (error) {
      console.error('Test error:', error);
      toast({
        title: "Test Error",
        description: "An error occurred while running tests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestJobPosting = async () => {
    setLoading(true);
    try {
      const result = await testJobPosting();
      
      if (result.success) {
        toast({
          title: "Job Posting Test Successful",
          description: "Job was posted successfully",
        });
      } else {
        toast({
          title: "Job Posting Test Failed",
          description: result.error,
          variant: "destructive"
        });
      }
      
      console.log('Job posting test result:', result);
    } catch (error) {
      console.error('Job posting test error:', error);
      toast({
        title: "Test Error",
        description: "An error occurred while testing job posting",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Job Posting Flow Tests</CardTitle>
            <p className="text-white/70">
              Use this page to test the job posting functionality. Open browser console to see detailed results.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <Button 
                onClick={handleRunTests}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {loading ? "Running Tests..." : "Run Basic Tests (Registration + Job Retrieval)"}
              </Button>
              
              <Button 
                onClick={handleTestJobPosting}
                disabled={loading}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              >
                {loading ? "Testing..." : "Test Job Posting (Requires Company Login)"}
              </Button>
            </div>

            {testResults && (
              <div className="space-y-4">
                <h3 className="text-white text-lg font-semibold">Test Results:</h3>
                
                <div className="grid gap-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white">Job Retrieval Test</span>
                        <Badge variant={testResults.jobRetrieval?.success ? "default" : "destructive"}>
                          {testResults.jobRetrieval?.success ? "PASS" : "FAIL"}
                        </Badge>
                      </div>
                      {testResults.jobRetrieval?.error && (
                        <p className="text-red-400 text-sm mt-2">{testResults.jobRetrieval.error}</p>
                      )}
                      {testResults.jobRetrieval?.data && (
                        <p className="text-green-400 text-sm mt-2">
                          Found {testResults.jobRetrieval.data.length} jobs
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white">Company Registration Test</span>
                        <Badge variant={testResults.companyRegistration?.success ? "default" : "destructive"}>
                          {testResults.companyRegistration?.success ? "PASS" : "FAIL"}
                        </Badge>
                      </div>
                      {testResults.companyRegistration?.error && (
                        <p className="text-red-400 text-sm mt-2">{testResults.companyRegistration.error}</p>
                      )}
                      {testResults.companyRegistration?.success && (
                        <div className="text-green-400 text-sm mt-2">
                          <p>Test account created successfully!</p>
                          <p>Email: {testResults.companyRegistration.email}</p>
                          <p className="text-yellow-400">⚠️ Check email for verification link</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-2">Manual Testing Steps:</h4>
              <ol className="text-white/70 text-sm space-y-1 list-decimal list-inside">
                <li>Run the database fix script in Supabase SQL editor</li>
                <li>Register a company account via /auth page</li>
                <li>Verify email and login</li>
                <li>Navigate to /company-dashboard</li>
                <li>Post a test job</li>
                <li>Check /jobs page to see the posted job</li>
              </ol>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h4 className="text-yellow-400 font-semibold mb-2">Important Notes:</h4>
              <ul className="text-yellow-300/80 text-sm space-y-1 list-disc list-inside">
                <li>Database RLS policies must be fixed first (run fix-database-policies.sql)</li>
                <li>Email verification is required for new accounts</li>
                <li>Job posting requires company user type in profile</li>
                <li>Check browser console for detailed error messages</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestJobFlow;
