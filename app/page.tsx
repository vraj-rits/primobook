"use client"
import { useState } from "react"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const MONTHS = [
  { month: "Oct", revenue: 38200, expenses: 28400 },
  { month: "Nov", revenue: 42800, expenses: 31100 },
  { month: "Dec", revenue: 55600, expenses: 34800 },
  { month: "Jan", revenue: 44200, expenses: 29900 },
  { month: "Feb", revenue: 49800, expenses: 32600 },
  { month: "Mar", revenue: 63050, expenses: 38458 },
]

const CATS = [
  { name: "Payroll", value: 36800, color: "#7C3AED" },
  { name: "Software", value: 7253, color: "#0284C7" },
  { name: "Marketing", value: 6290, color: "#D97706" },
  { name: "Rent", value: 4800, color: "#059669" },
  { name: "Travel", value: 2970, color: "#0891B2" },
  { name: "Other", value: 2345, color: "#64748B" },
]

const INVOICES = [
  { id: "PB-001", client: "Apex Dynamics", amount: 14200, due: "2025-04-15", status: "pending" },
  { id: "PB-002", client: "Starfield Inc", amount: 22500, due: "2025-03-30", status: "overdue" },
  { id: "PB-003", client: "Meridian Group", amount: 8750, due: "2025-04-10", status: "pending" },
  { id: "PB-004", client: "Crestwood LLC", amount: 3100, due: "2025-03-20", status: "paid" },
  { id: "PB-005", client: "Helio Partners", amount: 6400, due: "2025-05-01", status: "draft" },
]

const fmt = (n: number) => "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2 })
const fmtK = (n: number) => "$" + (n / 1000).toFixed(0) + "k"

const STATUS: Record<string, { bg: string; color: string; dot: string }> = {
  paid:    { bg: "#D1FAE5", color: "#065F46", dot: "#059669" },
  pending: { bg: "#FEF3C7", color: "#92400E", dot: "#D97706" },
  overdue: { bg: "#FEE2E2", color: "#991B1B", dot: "#DC2626" },
  draft:   { bg: "#F1F5F9", color: "#475569", dot: "#94A3B8" },
}

function Badge({ status }: { status: string }) {
  const s = STATUS[status] || STATUS.draft
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function KPI({ label, value, sub, subColor, accent }: { label: string; value: string; sub: string; subColor?: string; accent?: boolean }) {
  return (
    <div style={{ background: accent ? "#0B1F3A" : "#fff", border: accent ? "none" : "1px solid #E2E8F0", borderRadius: 14, padding: "22px 24px", flex: 1 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: accent ? "rgba(255,255,255,.5)" : "#64748B", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 700, color: accent ? "#fff" : "#0F172A", marginBottom: 8, fontFamily: "Georgia, serif", letterSpacing: "-.02em" }}>{value}</p>
      <p style={{ fontSize: 12, color: subColor || (accent ? "rgba(255,255,255,.4)" : "#64748B") }}>{sub}</p>
    </div>
  )
}

export default function PrimoBook() {
  const [tab, setTab] = useState("dashboard")
  const [invoices, setInvoices] = useState(INVOICES)
  const [invFilter, setInvFilter] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ client: "", amount: "", due: "", desc: "" })

  const income = 63050
  const expenses = 38458
  const profit = income - expenses

  const navItems = [
    { id: "dashboard", icon: "⬡", label: "Dashboard" },
    { id: "transactions", icon: "⇄", label: "Transactions" },
    { id: "invoices", icon: "◎", label: "Invoices" },
    { id: "reports", icon: "◫", label: "Reports" },
  ]

  const filteredInvoices = invFilter === "all" ? invoices : invoices.filter(i => i.status === invFilter)

  const addInvoice = () => {
    if (!form.client || !form.amount) return
    setInvoices([{ id: `PB-00${invoices.length + 1}`, client: form.client, amount: parseFloat(form.amount), due: form.due, status: "draft" }, ...invoices])
    setForm({ client: "", amount: "", due: "", desc: "" })
    setShowForm(false)
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F1F5F9", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F172A" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .nav-btn { transition: all .15s; } .nav-btn:hover { background: rgba(11,31,58,.06) !important; }
        .pill { transition: all .12s; cursor: pointer; } .pill:hover { border-color: #0B1F3A !important; color: #0B1F3A !important; }
        .trow:hover td { background: #F8FAFC !important; }
        input { outline: none; } input:focus { border-color: #0B1F3A !important; box-shadow: 0 0 0 3px rgba(11,31,58,.08) !important; }
      `}</style>

      {/* SIDEBAR */}
      <aside style={{ width: 230, background: "#fff", borderRight: "1px solid #E2E8F0", position: "fixed", top: 0, left: 0, bottom: 0, display: "flex", flexDirection: "column", zIndex: 100 }}>
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, background: "#0B1F3A", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#fff", fontWeight: 900, fontFamily: "Georgia, serif" }}>P</div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", fontFamily: "Georgia, serif" }}>Primo Book</p>
            <p style={{ fontSize: 10, color: "#64748B", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>Small Business · Pro</p>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          <p style={{ fontSize: 9, fontWeight: 800, color: "#CBD5E1", textTransform: "uppercase", letterSpacing: ".12em", padding: "0 8px", marginBottom: 8 }}>Navigation</p>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} className="nav-btn" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, border: "none", cursor: "pointer", width: "100%", textAlign: "left", background: tab === item.id ? "#0B1F3A" : "transparent", color: tab === item.id ? "#fff" : "#64748B", fontWeight: tab === item.id ? 700 : 500, fontSize: 13, marginBottom: 2, fontFamily: "inherit" }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#0B1F3A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>SL</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700 }}>Sales Leader</p>
            <p style={{ fontSize: 11, color: "#64748B" }}>admin@primobook.io</p>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: 230, flex: 1, padding: "36px 40px" }}>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "Georgia, serif", marginBottom: 4 }}>Good morning 👋</h2>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>Here&apos;s your financial summary · March 2025</p>
            <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
              <KPI label="Cash Balance" value="$124,300" sub="2 accounts connected" accent />
              <KPI label="Income (Mar)" value={fmt(income)} sub="↑ 26.5% vs February" subColor="#059669" />
              <KPI label="Expenses (Mar)" value={fmt(expenses)} sub="Auto-categorized" />
              <KPI label="Net Profit" value={fmt(profit)} sub={`${((profit / income) * 100).toFixed(1)}% margin`} subColor="#0B1F3A" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, marginBottom: 16 }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "22px 24px" }}>
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Revenue vs Expenses</p>
                <p style={{ fontSize: 12, color: "#64748B", marginBottom: 18 }}>6-month trend</p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={MONTHS}>
                    <defs>
                      <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0B1F3A" stopOpacity={0.1}/><stop offset="95%" stopColor="#0B1F3A" stopOpacity={0}/></linearGradient>
                      <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#059669" stopOpacity={0.08}/><stop offset="95%" stopColor="#059669" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3"/>
                    <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtK}/>
                    <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: 12 }} formatter={(v: number) => [fmt(v)]}/>
                    <Area type="monotone" dataKey="revenue" stroke="#0B1F3A" strokeWidth={2.5} fill="url(#gR)"/>
                    <Area type="monotone" dataKey="expenses" stroke="#059669" strokeWidth={2} fill="url(#gE)" strokeDasharray="5 4"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "22px 24px" }}>
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Expenses by Category</p>
                <p style={{ fontSize: 12, color: "#64748B", marginBottom: 16 }}>March 2025</p>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={CATS} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                      {CATS.map((c, i) => <Cell key={i} fill={c.color}/>)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [fmt(v)]}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 8 }}>
                  {CATS.slice(0, 4).map(c => (
                    <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "#64748B", display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: c.color, display: "inline-block" }}/>{c.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>{fmt(c.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TRANSACTIONS */}
        {tab === "transactions" && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "Georgia, serif", marginBottom: 4 }}>Transactions</h2>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>Connect a bank to import real transactions</p>
            <div style={{ background: "#fff", border: "2px dashed #E2E8F0", borderRadius: 16, padding: "60px 40px", textAlign: "center" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🏦</div>
              <p style={{ fontSize: 20, fontWeight: 700, fontFamily: "Georgia, serif", marginBottom: 8 }}>No bank connected yet</p>
              <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28, maxWidth: 400, margin: "0 auto 28px" }}>Connect your business bank account to automatically import and categorize your transactions.</p>
              <button style={{ background: "#0B1F3A", color: "#fff", border: "none", borderRadius: 9, padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Connect Bank Account →</button>
            </div>
          </div>
        )}

        {/* INVOICES */}
        {tab === "invoices" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "Georgia, serif", marginBottom: 4 }}>Invoices</h2>
                <p style={{ fontSize: 14, color: "#64748B" }}>{invoices.length} invoices · <span style={{ color: "#D97706", fontWeight: 600 }}>${invoices.filter(i => ["pending","overdue"].includes(i.status)).reduce((s,i) => s+i.amount,0).toLocaleString()} outstanding</span></p>
              </div>
              <button onClick={() => setShowForm(!showForm)} style={{ background: "#0B1F3A", color: "#fff", border: "none", borderRadius: 9, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ New Invoice</button>
            </div>

            {showForm && (
              <div style={{ background: "#fff", border: "1.5px solid rgba(11,31,58,.15)", borderRadius: 14, padding: 24, marginBottom: 20 }}>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>New Invoice</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                  {[["client","Client Name","text"],["amount","Amount ($)","number"],["due","Due Date","date"],["desc","Description","text"]].map(([k,lbl,type]) => (
                    <div key={k}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".07em" }}>{lbl}</label>
                      <input type={type} value={(form as Record<string,string>)[k]} onChange={e => setForm({...form,[k]:e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E2E8F0", borderRadius: 9, fontSize: 13, background: "#F8FAFC", fontFamily: "inherit" }}/>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={addInvoice} style={{ background: "#0B1F3A", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Create Invoice</button>
                  <button onClick={() => setShowForm(false)} style={{ background: "#fff", color: "#64748B", border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "9px 16px", fontSize: 13, cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {["all","draft","pending","paid","overdue"].map(f => (
                <button key={f} onClick={() => setInvFilter(f)} className="pill" style={{ padding: "7px 16px", borderRadius: 20, border: `1.5px solid ${invFilter===f?"#0B1F3A":"#E2E8F0"}`, background: invFilter===f?"#0B1F3A":"#fff", color: invFilter===f?"#fff":"#64748B", fontSize: 12, fontWeight: 600, fontFamily: "inherit", textTransform: "capitalize" }}>{f}</button>
              ))}
            </div>

            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                  {["Invoice","Client","Due Date","Amount","Status",""].map(h => <th key={h} style={{ textAlign:"left", padding:"12px 16px", fontSize:11, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:".07em" }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {filteredInvoices.map(inv => (
                    <tr key={inv.id} className="trow" style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding:"14px 16px", fontSize:12, fontWeight:700, color:"#1A3557" }}>{inv.id}</td>
                      <td style={{ padding:"14px 16px", fontSize:13, fontWeight:600 }}>{inv.client}</td>
                      <td style={{ padding:"14px 16px", fontSize:12, color:"#64748B" }}>{inv.due}</td>
                      <td style={{ padding:"14px 16px", fontSize:14, fontWeight:700 }}>{fmt(inv.amount)}</td>
                      <td style={{ padding:"14px 16px" }}><Badge status={inv.status}/></td>
                      <td style={{ padding:"14px 16px" }}>
                        {inv.status !== "paid" && <button onClick={() => setInvoices(invoices.map(i => i.id===inv.id?{...i,status:"paid"}:i))} style={{ background:"#D1FAE5", color:"#065F46", border:"none", borderRadius:7, padding:"5px 12px", fontSize:11, fontWeight:700, cursor:"pointer" }}>Mark Paid</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORTS */}
        {tab === "reports" && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "Georgia, serif", marginBottom: 4 }}>Reports</h2>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>March 2025 · Profit & Loss</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "24px 26px" }}>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Profit & Loss Statement</p>
                {[
                  { label: "Gross Revenue", val: income, pos: true, bold: false },
                  { label: "Operating Expenses", val: -expenses, bold: false },
                  { label: "Gross Profit", val: profit, pos: true, bold: true },
                  { label: "Est. Tax (21%)", val: -Math.round(profit*.21), bold: false },
                  { label: "Net Income", val: Math.round(profit*.79), pos: true, bold: true },
                ].map((r,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"11px 0", borderTop: r.bold?"2px solid #E2E8F0":"1px solid #F8FAFC" }}>
                    <span style={{ fontSize:13, color:r.bold?"#0F172A":"#64748B", fontWeight:r.bold?700:400 }}>{r.label}</span>
                    <span style={{ fontSize:r.bold?16:13, fontWeight:700, color:r.val>0?"#059669":"#DC2626", fontFamily:r.bold?"Georgia, serif":"inherit" }}>{r.val<0?"-":""}{fmt(Math.abs(r.val))}</span>
                  </div>
                ))}
                <div style={{ background:"#F8FAFC", borderRadius:10, padding:"14px 16px", marginTop:16 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}><span style={{ fontSize:12, color:"#64748B" }}>Net Margin</span><span style={{ fontSize:12, fontWeight:700, color:"#0B1F3A" }}>{((profit*.79/income)*100).toFixed(1)}%</span></div>
                  <div style={{ height:6, background:"#E2E8F0", borderRadius:3 }}><div style={{ width:`${((profit*.79/income)*100).toFixed(0)}%`, height:"100%", background:"#0B1F3A", borderRadius:3 }}/></div>
                </div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "24px 26px" }}>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>6-Month Trend</p>
                <p style={{ fontSize: 12, color: "#64748B", marginBottom: 18 }}>Revenue & profit</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={MONTHS}>
                    <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="month" tick={{ fill:"#64748B", fontSize:11 }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fill:"#64748B", fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={fmtK}/>
                    <Tooltip contentStyle={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:8, fontSize:12 }} formatter={(v:number) => [fmt(v)]}/>
                    <Bar dataKey="revenue" name="Revenue" fill="#0B1F3A" radius={[4,4,0,0]}/>
                    <Bar dataKey="expenses" name="Expenses" fill="#059669" radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}