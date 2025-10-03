# Analysis Results Database Integration

This document explains how to integrate the new database tables for storing QA Review, Coding Review, and Financial Optimization results.

## Database Schema

### Tables Created:
1. `qa_review_results` - Stores QA Review analysis results
2. `coding_review_results` - Stores Coding Review analysis results  
3. `financial_optimization_results` - Stores Financial Optimization analysis results

### Key Features:
- **Unrestricted Access**: All agencies can access all analysis results (RLS disabled)
- **JSONB Storage**: Complete analysis results stored as JSONB for flexibility
- **Indexed**: Optimized for queries by agency, analysis type, status, and creation date
- **Audit Trail**: Created/updated timestamps with automatic triggers
- **Foreign Keys**: Linked to agency table for data integrity

## Integration Steps

### 1. Run Database Migration
```sql
-- Execute the create_analysis_results_tables.sql file in your Supabase SQL editor
-- This creates all tables, indexes, policies, and triggers
```

### 2. Update Environment Variables
Add to your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Update Your Analysis Services

#### For QA Analysis Service:
```typescript
// In lib/services/qaAnalysisService.ts
import AnalysisResultsService from './analysisResultsService';

class QAAnalysisService {
  private analysisResultsService = new AnalysisResultsService();

  async analyzeFile(...) {
    // ... existing analysis logic ...
    
    // Save to database instead of in-memory
    const dbResult = await this.analysisResultsService.saveQAReviewResult({
      agency_id: agencyId,
      analysis_id: result.analysisId,
      file_name: result.fileName,
      analysis_type: 'qa-review',
      status: result.status,
      priority: result.priority,
      patient_id: result.patientId,
      processing_notes: result.processingNotes,
      ai_model: result.aiModel,
      results: result.results,
      confidence: result.confidence,
      processing_time: result.processingTime
    });

    return dbResult;
  }
}
```

#### For Coding Analysis Service:
```typescript
// In lib/services/codingAnalysisService.ts
import AnalysisResultsService from './analysisResultsService';

class CodingAnalysisService {
  private analysisResultsService = new AnalysisResultsService();

  async analyzeFile(...) {
    // ... existing analysis logic ...
    
    // Save to database
    const dbResult = await this.analysisResultsService.saveCodingReviewResult({
      agency_id: agencyId,
      analysis_id: result.analysisId,
      file_name: result.fileName,
      analysis_type: 'coding-review',
      status: result.status,
      priority: result.priority,
      patient_id: result.patientId,
      processing_notes: result.processingNotes,
      ai_model: result.aiModel,
      results: result.results,
      confidence: result.confidence,
      processing_time: result.processingTime
    });

    return dbResult;
  }
}
```

#### For Financial Optimization Service:
```typescript
// In lib/services/financialOptimizationService.ts
import AnalysisResultsService from './analysisResultsService';

class FinancialOptimizationService {
  private analysisResultsService = new AnalysisResultsService();

  async analyzeFile(...) {
    // ... existing analysis logic ...
    
    // Save to database
    const dbResult = await this.analysisResultsService.saveFinancialOptimizationResult({
      agency_id: agencyId,
      analysis_id: result.analysisId,
      file_name: result.fileName,
      analysis_type: 'financial-optimization',
      status: result.status,
      priority: result.priority,
      patient_id: result.patientId,
      processing_notes: result.processingNotes,
      ai_model: result.aiModel,
      results: result.results,
      confidence: result.confidence,
      processing_time: result.processingTime
    });

    return dbResult;
  }
}
```

### 4. Update Frontend to Use Database

#### Update fetchResults function in page.tsx:
```typescript
const fetchResults = async () => {
  try {
    // Get agency email from auth context
    const agencyEmail = getCurrentAgencyEmail(); // Implement this
    
    const response = await fetch(`/api/analysis-results?agencyEmail=${agencyEmail}`);
    const result = await response.json();
    
    if (result.success) {
      setAnalysisResults(result.results);
    }
  } catch (error) {
    console.error('Error fetching results:', error);
  }
};
```

### 5. Update API Routes

#### Update your analysis API routes to save results:
```typescript
// In app/api/qa-analysis/route.ts
import AnalysisResultsService from '@/lib/services/analysisResultsService';

export async function POST(request: NextRequest) {
  // ... existing analysis logic ...
  
  // After successful analysis, save to database
  const analysisResultsService = new AnalysisResultsService();
  
  // Get agency email from request headers or auth
  const agencyEmail = request.headers.get('x-agency-email');
  
  await analysisResultsService.saveQAReviewResult({
    agency_id: agency.id,
    analysis_id: result.analysisId,
    file_name: result.fileName,
    analysis_type: 'qa-review',
    status: result.status,
    priority: result.priority,
    patient_id: result.patientId,
    processing_notes: result.processingNotes,
    ai_model: result.aiModel,
    results: result.results,
    confidence: result.confidence,
    processing_time: result.processingTime
  });
  
  return NextResponse.json(result);
}
```

## Benefits

### 1. **Persistence**: Results survive server restarts and deployments
### 2. **Unrestricted Access**: All agencies can view all analysis results
### 3. **Scalability**: Database handles large volumes of results efficiently
### 4. **Searchability**: JSONB allows complex queries on analysis data
### 5. **Audit Trail**: Track when analyses were created and updated
### 6. **Performance**: Indexed for fast queries by agency and date

## Security

- **No Row Level Security (RLS)** - all agencies can access all results
- **Foreign key constraints** maintain data integrity
- **Service role key** used for server-side operations
- **No direct client access** to sensitive analysis data

## Monitoring

Use the verification script to monitor:
- Table sizes and growth
- Index performance
- Query execution times
- Table access patterns (since RLS is disabled)

## Rollback Plan

If needed, you can rollback by:
1. Dropping the new tables
2. Reverting to in-memory storage
3. The original functionality will continue to work

```sql
-- Rollback script (use with caution)
DROP TABLE IF EXISTS public.financial_optimization_results CASCADE;
DROP TABLE IF EXISTS public.coding_review_results CASCADE;
DROP TABLE IF EXISTS public.qa_review_results CASCADE;
```
