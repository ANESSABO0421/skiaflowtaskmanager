import { LeadStatus } from "../types/leads.types"

const colors = {
  new: 'bg-blue-100 text-blue-700',

  discussion:
    'bg-yellow-100 text-yellow-700',

  proposal_sent:
    'bg-purple-100 text-purple-700',

  approved:
    'bg-green-100 text-green-700',

  rejected:
    'bg-red-100 text-red-700',

  on_hold:
    'bg-gray-200 text-gray-700',
}

export default function LeadStatusBadge({
  status,
}: {
  status: LeadStatus
}) {
  return (
    <span className={`px-3 py-1 rounded-full text-sm ${colors[status]}`}>
      {status}
    </span>
  )
}