# Type System Rollout Checklist
**Status:** In Progress (Phase 1/2 Complete)  
**Updated:** March 7, 2025

## Phase 1: Foundation Setup ✅ COMPLETE

- ✅ Updated Profile interface with all 37 database fields
- ✅ Created Referral interface and migration 006
- ✅ Created email types in `/types/email.ts`
- ✅ Created comprehensive Zod validators in `/lib/validators.ts`
- ✅ Fixed PDF type safety (removed `as any` casts)
- ✅ Applied validators to profile endpoint
- ✅ Applied validators to send-proposal endpoint
- ✅ Created documentation (`TYPE_SYSTEM_ARCHITECTURE.md`)
- ✅ Created engineering report (`ENGINEERING_SESSION_REPORT.md`)

## Phase 2: API Route Conversion (In Progress)

### Priority 1: Critical Routes (High Impact)

- [ ] `/api/proposals/[id]/route.ts` (GET/PATCH/DELETE)
  - Add `proposalCreateSchema` validation
  - Type responses as `Proposal`
  - Verify all 30 fields included
  - Estimated effort: 1h

- [ ] `/api/proposals/[id]/line-items/route.ts` (GET/POST)
  - Add `lineItemSchema` validation for POST
  - Type response as `ProposalLineItem[]`
  - Enforce ownership checks
  - Estimated effort: 1h

- [ ] `/api/clients/route.ts` (GET/POST)
  - Add `clientCreateSchema` validation
  - Type response as `Client`
  - Add pagination support
  - Estimated effort: 1.5h

- [ ] `/api/templates/route.ts` (GET/POST)
  - Add `templateCreateSchema` validation
  - Type response as `Template[]`
  - Add category filtering
  - Estimated effort: 1.5h

### Priority 2: Email Routes (Medium Impact)

- [ ] `/api/emails/follow-up/route.ts`
  - Create `SendFollowUpEmailRequest` type in email.ts
  - Add schema validation
  - Type response correctly
  - Estimated effort: 1h

- [ ] `/api/emails/welcome/route.ts`
  - Type incoming request
  - Add schema validation
  - Estimated effort: 0.5h

- [ ] `/api/emails/preview-proposal/route.ts`
  - Type incoming request
  - Add schema validation
  - Estimated effort: 0.5h

### Priority 3: Auth Routes (Lower Impact)

- [ ] `/api/auth/callback/route.ts`
  - Review for type safety
  - Document callback signature
  - Estimated effort: 0.5h

### Priority 4: Remaining Routes

- [ ] `/api/stripe/webhook/route.ts`
  - Validate webhook payload schema
  - Type Stripe event handling
  - Estimated effort: 1.5h

- [ ] `/api/proposal/[shareId]/public-routes`
  - Type public proposal endpoints
  - Add rate limiting type validation
  - Estimated effort: 0.5h

## Phase 3: Test & Documentation (Pending)

### Unit Tests for Validators

- [ ] Test `profileUpdateSchema` with valid/invalid data
  - Valid: all fields, partial updates, edge cases
  - Invalid: wrong types, out of range, format violations
  - Estimated effort: 1h

- [ ] Test `proposalCreateSchema`
  - Valid: minimal, full, with line items
  - Invalid: missing required fields, invalid types
  - Estimated effort: 1h

- [ ] Test `sendProposalEmailSchema`
  - Valid: required only, with subject and message
  - Invalid: bad email, missing proposalId
  - Estimated effort: 0.5h

- [ ] Test remaining validators
  - Estimated effort: 1.5h

### Integration Tests

- [ ] API endpoint tests with validation
  - Test 400 responses on invalid input
  - Test 401 on auth failure
  - Test 200 with valid data
  - Estimated effort: 2h

### API Documentation

- [ ] Update `/api-docs/page.tsx` with Zod schemas
  - Include example requests/responses
  - Document validation error formats
  - Estimated effort: 2h

- [ ] Update README.md with type system section
  - Link to TYPE_SYSTEM_ARCHITECTURE.md
  - Quick start guide for adding new validators
  - Estimated effort: 1h

## Phase 4: Deployment & Monitoring (Future)

- [ ] Add pre-commit hook to check TypeScript

- [ ] Setup error tracking for validation failures
  - Log all 400 validation errors to analytics
  - Monitor patterns for API misuse

- [ ] Add metrics dashboard
  - Validation success rate
  - Common validation errors
  - Type coverage percentage

- [ ] Load test validators
  - Test with large payloads
  - Measure parsing time
  - Ensure < 1ms overhead

## Implementation Examples

### Template for Converting a Route

```typescript
// 1. Import validator and type
import { mySchema, type MyType } from "@/lib/validators";

export async function POST(request: Request): Promise<NextResponse<MyType>> {
  // 2. Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 3. Parse and validate
  const body = await request.json();
  const result = mySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: `Invalid input: ${result.error.message}` },
      { status: 400 }
    );
  }

  const validated = result.data;

  // 4. Business logic with validated data
  const { data, error } = await supabase
    .from("table")
    .insert({ ...validated, user_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 5. Return typed response
  return NextResponse.json<MyType>(data);
}
```

## Progress Tracking

### Estimated Total Effort
- Phase 1 Foundation: ✅ 8h (COMPLETE)
- Phase 2 API Routes: ⏳ 12h (estimated)
- Phase 3 Tests & Docs: ⏳ 10h (estimated)
- Phase 4 Deployment: ⏳ 4h (estimated)

**Total:** ~34 hours of focused engineering work

### Risk Assessment

**Low Risk:**
- ✅ All changes are additive (backward compatible)
- ✅ Type system is private (doesn't affect runtime for existing code)
- ✅ Validators only added to request handling

**Considerations:**
- Validation might reject some malformed requests that previously passed
- Requires testing to ensure no legitimate requests are blocked

## Quick Start: Adding a New Validator

1. Add schema to `/lib/validators.ts`:
   ```typescript
   export const mySchema = z.object({
     name: z.string().min(1).max(255),
     email: z.string().email(),
   });
   
   export type MyType = z.infer<typeof mySchema>;
   ```

2. Use in API route:
   ```typescript
   const result = mySchema.safeParse(body);
   if (!result.success) {
     return NextResponse.json({ error: result.error.message }, { status: 400 });
   }
   const validated = result.data;
   ```

3. Update TypeScript type:
   ```typescript
   export interface MyData extends MyType {
     id: string;
     created_at: string;
   }
   ```

## Communication to Team

- [ ] Share this checklist with development team
- [ ] Schedule 1h walkthrough of TYPE_SYSTEM_ARCHITECTURE.md
- [ ] Create pair programming plan for Phase 2 conversion
- [ ] Setup weekly progress check-ins

## Dependencies & Assumptions

- ✅ Zod already installed in package.json
- ✅ Next.js 14.2+ (using app router)
- ✅ TypeScript 5.6+ with strict mode enabled
- ✅ All API routes use async server functions
- ⚠️ No breaking changes to existing API contracts during migration

## Success Criteria

Phase 2 completion means:
- ✅ All API routes have request validation
- ✅ All API responses are properly typed
- ✅ Type coverage reaches 99%+
- ✅ Zero remaining `as any` casts (except justified cases)
- ✅ Test suite covers all validators
- ✅ Documentation complete
- ✅ No validation-related bugs in production for 2 weeks post-launch

## Notes

- Start with `/api/proposals/*` routes (highest risk if type-unsafe)
- Test email routes thoroughly (customer-facing failures)
- Consider beta testing validator changes with power users
- Monitor validation error rates in first week post-deployment
