'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSpinner, faCheck, faTimes, faPlus, faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons'
import { getAdminPlans, createPlan, updatePlan, deletePlan, Plan, PlanCreateRequest, PlanUpdateRequest } from '@/lib/admin'

export function PlanosSection() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [formData, setFormData] = useState<Partial<PlanCreateRequest>>({
    id: '',
    name: '',
    description: '',
    transactionFee: 70,
    monthlyFee: 0,
    minTransactions: 0,
    maxTransactions: null,
    downgradeTo: null,
    order: 0,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAdminPlans()
      setPlans(response.data.plans)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar planos')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      transactionFee: 70,
      monthlyFee: 0,
      minTransactions: 0,
      maxTransactions: null,
      downgradeTo: null,
      order: plans.length,
    })
    setEditingPlan(null)
    setShowCreateModal(true)
  }

  const handleEdit = (plan: Plan) => {
    setFormData({
      id: plan.id,
      name: plan.name,
      description: plan.description || '',
      transactionFee: plan.transactionFee,
      monthlyFee: plan.monthlyFee,
      minTransactions: plan.minTransactions,
      maxTransactions: plan.maxTransactions,
      downgradeTo: plan.downgradeTo,
      order: plan.order,
    })
    setEditingPlan(plan)
    setShowCreateModal(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      if (!formData.id || !formData.name) {
        setError('ID e Nome são obrigatórios')
        return
      }

      if (editingPlan) {
        // Atualizar
        const updateData: PlanUpdateRequest = {
          name: formData.name,
          description: formData.description,
          transactionFee: formData.transactionFee,
          monthlyFee: formData.monthlyFee,
          minTransactions: formData.minTransactions,
          maxTransactions: formData.maxTransactions === null ? null : formData.maxTransactions,
          downgradeTo: formData.downgradeTo || null,
          order: formData.order,
        }
        await updatePlan(editingPlan.id, updateData)
        setSuccess('Plano atualizado com sucesso!')
      } else {
        // Criar
        const createData: PlanCreateRequest = {
          id: formData.id.toUpperCase(),
          name: formData.name,
          description: formData.description,
          transactionFee: formData.transactionFee || 70,
          monthlyFee: formData.monthlyFee || 0,
          minTransactions: formData.minTransactions || 0,
          maxTransactions: formData.maxTransactions === null ? null : formData.maxTransactions,
          downgradeTo: formData.downgradeTo || null,
          order: formData.order || plans.length,
        }
        await createPlan(createData)
        setSuccess('Plano criado com sucesso!')
      }

      await loadPlans()
      setShowCreateModal(false)
      setEditingPlan(null)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar plano')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (planId: string) => {
    if (!confirm(`Tem certeza que deseja desativar o plano ${planId}?`)) {
      return
    }

    try {
      setError(null)
      await deletePlan(planId)
      setSuccess('Plano desativado com sucesso!')
      await loadPlans()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao desativar plano')
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100)
  }

  const filteredPlans = plans.filter((plan) => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      plan.name.toLowerCase().includes(searchLower) ||
      plan.id.toLowerCase().includes(searchLower) ||
      (plan.description || '').toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-foreground">Gerenciar Planos</h2>
        <div className="flex gap-2">
          <button
            onClick={loadPlans}
            className="px-4 py-2 rounded-lg border border-foreground/10 text-foreground hover:bg-foreground/5 transition-colors"
          >
            Atualizar
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            Novo Plano
          </button>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500">
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
          {error}
        </div>
      )}

      {/* Busca */}
      <div className="relative">
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar plano por nome, ID ou descrição..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-foreground/2 border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Lista de Planos */}
      <div className="rounded-xl border border-foreground/10 bg-foreground/2 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-foreground/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                  Taxa Transação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                  Mensalidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                  Transações
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                  Ordem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <FontAwesomeIcon icon={faSpinner} className="w-6 h-6 text-primary animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-foreground/60">
                    Nenhum plano encontrado
                  </td>
                </tr>
              ) : (
                filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-foreground/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">{plan.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">{plan.name}</div>
                      {plan.description && (
                        <div className="text-xs text-foreground/60 mt-1">{plan.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70">
                      {formatCurrency(plan.transactionFee)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70">
                      {formatCurrency(plan.monthlyFee)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70">
                      {plan.minTransactions} - {plan.maxTransactions === null ? '∞' : plan.maxTransactions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70">
                      {plan.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          plan.active
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {plan.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(plan)}
                          className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
                          title="Editar"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        {plan.active && (
                          <button
                            onClick={() => handleDelete(plan.id)}
                            className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                            title="Desativar"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Criar/Editar */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl border border-foreground/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-foreground/10 flex items-center justify-between sticky top-0 bg-background">
              <h3 className="text-xl font-bold text-foreground">
                {editingPlan ? 'Editar Plano' : 'Novo Plano'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setEditingPlan(null)
                }}
                className="text-foreground/60 hover:text-foreground"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {!editingPlan && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ID do Plano <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value.toUpperCase() })}
                    placeholder="Ex: PREMIUM"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    disabled={!!editingPlan}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Premium"
                  className="w-full px-4 py-2 rounded-lg bg-background border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do plano..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Taxa por Transação (centavos) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.transactionFee}
                    onChange={(e) => setFormData({ ...formData, transactionFee: parseInt(e.target.value) || 0 })}
                    placeholder="70"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {formData.transactionFee && (
                    <p className="text-xs text-foreground/60 mt-1">
                      {formatCurrency(formData.transactionFee)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mensalidade (centavos) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {formData.monthlyFee && (
                    <p className="text-xs text-foreground/60 mt-1">
                      {formatCurrency(formData.monthlyFee)}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mínimo de Transações <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.minTransactions}
                    onChange={(e) => setFormData({ ...formData, minTransactions: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Máximo de Transações (deixe vazio para ilimitado)
                  </label>
                  <input
                    type="number"
                    value={formData.maxTransactions === null ? '' : formData.maxTransactions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxTransactions: e.target.value === '' ? null : parseInt(e.target.value) || null,
                      })
                    }
                    placeholder="300"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Plano de Downgrade (ID)
                  </label>
                  <input
                    type="text"
                    value={formData.downgradeTo || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, downgradeTo: e.target.value.toUpperCase() || null })
                    }
                    placeholder="FREE"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Ordem</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingPlan(null)
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-foreground/10 text-foreground hover:bg-foreground/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.id || !formData.name}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} />
                      Salvar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
