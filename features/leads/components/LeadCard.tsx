'use client'

import { deleteLeads, updateLeads } from '../services/leadService'

import {
  Lead,
  LeadStatus,
} from '../types/leads.types'

import LeadStatusBadge from './LeadStatusBadge'

import { useLeadStore } from '@/store/leadStore'

export default function LeadCard({
  lead,
}: {
  lead: Lead
}) {
  const removeLead = useLeadStore(
    (state) => state.removeLead
  )

  const updateLeadStore =
    useLeadStore(
      (state) => state.updateLead
    )

  const handleDelete = async () => {
    const confirmed =
      confirm('Delete lead?')

    if (!confirmed) return

    const { error } = await deleteLeads(
      lead.id
    )

    if (error) {
      alert(error.message)
      return
    }

    removeLead(lead.id)
  }

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {

    const status =
      e.target.value as LeadStatus

    const { error } =
      await updateLeads(lead.id, {
        status,
      })

    if (error) {
      alert(error.message)
      return
    }

    updateLeadStore(lead.id, {
      status,
    })
  }

  return (
    <div className="border rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {lead.client_name}
        </h2>

        <LeadStatusBadge
          status={lead.status}
        />
      </div>

      <div className="space-y-1 text-sm">
        <p>{lead.company_name}</p>

        <p>{lead.email}</p>

        <p>{lead.phone}</p>

        <p>{lead.project_type}</p>

        <p>₹ {lead.budget}</p>
      </div>

      <select
        value={lead.status}
        onChange={handleStatusChange}
        className="border p-2 rounded-lg w-full"
      >
        <option value="new">
          New
        </option>

        <option value="discussion">
          Discussion
        </option>

        <option value="proposal_sent">
          Proposal Sent
        </option>

        <option value="approved">
          Approved
        </option>

        <option value="rejected">
          Rejected
        </option>

        <option value="on_hold">
          On Hold
        </option>
      </select>

      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Delete
      </button>
    </div>
  )
}