
import PageWrapper from '@/components/layout/PageWrapper'
import LeadForm from '@/features/leads/components/LeadForm'

import LeadList from '@/features/leads/components/LeadList'

export default function LeadsPage() {
  return (
    <PageWrapper title="Leads">
      <div className="space-y-10">
        <LeadForm />

        <LeadList />
      </div>
    </PageWrapper>
  )
}