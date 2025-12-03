'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faLock, faUnlock, faEye, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { getAdminUsers, getAdminUser, blockUser, AdminUser, AdminUserDetails } from '@/lib/admin'

export function UsuariosSection() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [blockedFilter, setBlockedFilter] = useState<string>('')
  const [selectedUser, setSelectedUser] = useState<AdminUserDetails | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [loadingUser, setLoadingUser] = useState(false)

  const limit = 20

  useEffect(() => {
    loadUsers()
  }, [page, statusFilter, blockedFilter])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const params: any = {
        limit,
        offset: (page - 1) * limit,
      }
      if (statusFilter) params.status = statusFilter
      if (blockedFilter) params.blocked = blockedFilter === 'true'

      const response = await getAdminUsers(params)
      setUsers(response.data.users)
      setTotal(response.data.pagination.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    loadUsers()
  }

  const handleViewUser = async (userId: string) => {
    try {
      setLoadingUser(true)
      const response = await getAdminUser(userId)
      setSelectedUser(response.data.user as AdminUserDetails)
      setShowUserModal(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuário')
    } finally {
      setLoadingUser(false)
    }
  }

  const handleBlockUser = async (userId: string, blocked: boolean) => {
    try {
      await blockUser(userId, blocked)
      await loadUsers()
      if (selectedUser && selectedUser.id === userId) {
        const response = await getAdminUser(userId)
        setSelectedUser(response.data.user as AdminUserDetails)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao bloquear/desbloquear usuário')
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100)
  }

  const filteredUsers = users.filter((user) => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.id.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Gerenciar Usuários</h2>
        <button
          onClick={loadUsers}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Atualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-foreground/10 bg-foreground/2">
        <div className="flex-1 relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Buscar por nome, email ou ID..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-background border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Todos os status</option>
          <option value="active">Ativo</option>
          <option value="deleted">Deletado</option>
        </select>
        <select
          value={blockedFilter}
          onChange={(e) => setBlockedFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-background border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Todos</option>
          <option value="true">Bloqueados</option>
          <option value="false">Não bloqueados</option>
        </select>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
          {error}
        </div>
      )}

      {/* Tabela de Usuários */}
      <div className="rounded-xl border border-foreground/10 bg-foreground/2 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-foreground/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                  Saldo
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
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <FontAwesomeIcon icon={faSpinner} className="w-6 h-6 text-primary animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-foreground/60">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-foreground/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">{user.name}</div>
                      <div className="text-xs text-foreground/60">{user.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                        {user.plan || 'FREE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {formatCurrency(user.balance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.blocked
                            ? 'bg-red-500/10 text-red-500'
                            : user.status === 'active'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-gray-500/10 text-gray-500'
                        }`}
                      >
                        {user.blocked ? 'Bloqueado' : user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewUser(user.id)}
                          className="text-primary hover:text-primary/80 transition-colors"
                          title="Ver detalhes"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={() => handleBlockUser(user.id, !user.blocked)}
                          className={`transition-colors ${
                            user.blocked
                              ? 'text-green-500 hover:text-green-600'
                              : 'text-red-500 hover:text-red-600'
                          }`}
                          title={user.blocked ? 'Desbloquear' : 'Bloquear'}
                        >
                          <FontAwesomeIcon icon={user.blocked ? faUnlock : faLock} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-foreground/60">
          Mostrando {filteredUsers.length} de {total} usuários
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-foreground/5 text-foreground hover:bg-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          <span className="text-sm text-foreground/70">Página {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page * limit >= total}
            className="px-4 py-2 rounded-lg bg-foreground/5 text-foreground hover:bg-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Próxima
          </button>
        </div>
      </div>

      {/* Modal de Detalhes do Usuário */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl border border-foreground/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-foreground/10 flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">Detalhes do Usuário</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-foreground/60 hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-foreground/70">Nome</label>
                  <p className="text-foreground font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="text-sm text-foreground/70">Email</label>
                  <p className="text-foreground font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm text-foreground/70">CPF/CNPJ</label>
                  <p className="text-foreground font-medium">{selectedUser.taxID}</p>
                </div>
                <div>
                  <label className="text-sm text-foreground/70">Telefone</label>
                  <p className="text-foreground font-medium">{selectedUser.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-foreground/70">Plano</label>
                  <p className="text-foreground font-medium">{selectedUser.plan || 'FREE'}</p>
                </div>
                <div>
                  <label className="text-sm text-foreground/70">Status</label>
                  <p className="text-foreground font-medium">
                    {selectedUser.blocked ? 'Bloqueado' : selectedUser.status}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-foreground/70">Saldo</label>
                  <p className="text-foreground font-medium">{formatCurrency(selectedUser.balance)}</p>
                </div>
                <div>
                  <label className="text-sm text-foreground/70">Saldo Split</label>
                  <p className="text-foreground font-medium">{formatCurrency(selectedUser.saldo_split)}</p>
                </div>
              </div>

              {selectedUser.statistics && (
                <div className="mt-6 pt-6 border-t border-foreground/10">
                  <h4 className="text-lg font-bold text-foreground mb-4">Estatísticas</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-foreground/70">Pagamentos Totais</label>
                      <p className="text-foreground font-medium">{selectedUser.statistics.totalPayments}</p>
                    </div>
                    <div>
                      <label className="text-sm text-foreground/70">Pagamentos Completos</label>
                      <p className="text-foreground font-medium">{selectedUser.statistics.completedPayments}</p>
                    </div>
                    <div>
                      <label className="text-sm text-foreground/70">Total Recebido</label>
                      <p className="text-foreground font-medium">
                        {formatCurrency(selectedUser.statistics.totalReceived)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-foreground/70">Total em Taxas</label>
                      <p className="text-foreground font-medium">
                        {formatCurrency(selectedUser.statistics.totalFees)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-foreground/70">Saques Totais</label>
                      <p className="text-foreground font-medium">{selectedUser.statistics.totalWithdraws}</p>
                    </div>
                    <div>
                      <label className="text-sm text-foreground/70">Total Sacado</label>
                      <p className="text-foreground font-medium">
                        {formatCurrency(selectedUser.statistics.totalWithdrawn)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-foreground/10 flex gap-4">
                <button
                  onClick={() => handleBlockUser(selectedUser.id, !selectedUser.blocked)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedUser.blocked
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {selectedUser.blocked ? 'Desbloquear Usuário' : 'Bloquear Usuário'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

