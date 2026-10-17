/* SIM Magang - prototipe frontend. Data contoh disimpan hanya pada localStorage browser ini.
   Belum terhubung ke server/database dan belum memiliki autentikasi sungguhan. */
(() => {
  const STORAGE_KEY = "sim-magang-demo-v1";
  const defaultData = {
    periods: [
      {id:"P001",name:"Oktober 2026",start:"2026-10-01",end:"2026-10-31",quota:10,status:"Aktif"},
      {id:"P002",name:"November 2026",start:"2026-11-01",end:"2026-11-30",quota:12,status:"Aktif"},
      {id:"P003",name:"Desember 2026",start:"2026-12-01",end:"2026-12-31",quota:8,status:"Belum dibuka"}
    ],
    participants: [
      {id:"M001",name:"Andi Pratama",campus:"Universitas Bantul",major:"Sistem Informasi",periodId:"P001",status:"Diterima",updatedAt:1},
      {id:"M002",name:"Siti Rahmawati",campus:"Universitas Negeri Yogyakarta",major:"Agribisnis",periodId:"P001",status:"Diterima",updatedAt:2},
      {id:"M003",name:"Dimas Saputra",campus:"Institut Teknologi Yogyakarta",major:"Informatika",periodId:"P001",status:"Menunggu",updatedAt:3},
      {id:"M004",name:"Nadia Putri",campus:"Universitas Bantul",major:"Manajemen",periodId:"P001",status:"Diterima",updatedAt:4},
      {id:"M005",name:"Bima Aditya",campus:"Universitas Negeri Yogyakarta",major:"Ilmu Komunikasi",periodId:"P001",status:"Selesai",updatedAt:5},
      {id:"M006",name:"Rani Puspitasari",campus:"Politeknik Yogyakarta",major:"Administrasi Bisnis",periodId:"P001",status:"Diterima",updatedAt:6},
      {id:"M007",name:"Fajar Nugroho",campus:"Universitas Bantul",major:"Teknik Informatika",periodId:"P001",status:"Ditolak",updatedAt:7},
      {id:"M008",name:"Laras Wulandari",campus:"Universitas Negeri Yogyakarta",major:"Pendidikan Biologi",periodId:"P001",status:"Diterima",updatedAt:8},
      {id:"M009",name:"Yoga Kurniawan",campus:"Institut Pertanian Yogyakarta",major:"Agroteknologi",periodId:"P002",status:"Diterima",updatedAt:9},
      {id:"M010",name:"Intan Permata",campus:"Universitas Bantul",major:"Sistem Informasi",periodId:"P002",status:"Menunggu",updatedAt:10},
      {id:"M011",name:"Rizky Maulana",campus:"Politeknik Yogyakarta",major:"Manajemen Informatika",periodId:"P002",status:"Diterima",updatedAt:11},
      {id:"M012",name:"Dewi Anggraini",campus:"Universitas Negeri Yogyakarta",major:"Agribisnis",periodId:"P002",status:"Menunggu",updatedAt:12},
      {id:"M013",name:"Arif Setiawan",campus:"Institut Pertanian Yogyakarta",major:"Agroteknologi",periodId:"P002",status:"Diterima",updatedAt:13},
      {id:"M014",name:"Maya Safitri",campus:"Universitas Bantul",major:"Akuntansi",periodId:"P002",status:"Menunggu",updatedAt:14}
    ]
  };
  let data = loadData();
  let statusChart = null;
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const fmtDate = (s) => s ? new Date(`${s}T00:00:00`).toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"}) : "—";
  const periodById = (id) => data.periods.find(p=>p.id===id);
  const participantsFor = (periodId) => data.participants.filter(p=>p.periodId===periodId);
  const countsFor = (periodId) => {
    const ps = participantsFor(periodId);
    return {total:ps.length,accepted:ps.filter(p=>["Diterima","Selesai"].includes(p.status)).length,pending:ps.filter(p=>p.status==="Menunggu").length,rejected:ps.filter(p=>p.status==="Ditolak").length,done:ps.filter(p=>p.status==="Selesai").length};
  };
  const totalQuota = () => data.periods.reduce((s,p)=>s+Number(p.quota||0),0);
  const acceptedAll = () => data.participants.filter(p=>["Diterima","Selesai"].includes(p.status)).length;
  const remainingAll = () => data.periods.reduce((s,p)=>s+Math.max(0,Number(p.quota)-countsFor(p.id).accepted),0);
  function loadData(){try{const raw=localStorage.getItem(STORAGE_KEY);if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed.periods)&&Array.isArray(parsed.participants))return parsed;}}catch(e){}return structuredClone(defaultData);}
  function saveData(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}
  function showToast(message){$("toastMessage").textContent=message;bootstrap.Toast.getOrCreateInstance($("appToast"),{delay:2800}).show();}
  function initials(name){return String(name||"?").trim().split(/\s+/).slice(0,2).map(x=>x[0]||"").join("").toUpperCase();}
  function statusClass(status){return {"Diterima":"status-diterima","Menunggu":"status-menunggu","Ditolak":"status-ditolak","Selesai":"status-selesai"}[status]||"status-menunggu";}
  function statusBadge(status){return `<span class="status-badge ${statusClass(status)}">${esc(status)}</span>`;}
  function renderAll(){saveData();renderDashboard();renderPeriods();renderParticipants();renderReports();fillPeriodSelects();}
  function renderDashboard(){
    $("statQuota").textContent=totalQuota();
    $("statAccepted").textContent=acceptedAll();
    $("statPending").textContent=data.participants.filter(p=>p.status==="Menunggu").length;
    $("statRemaining").textContent=remainingAll();
    const rem=remainingAll(), tq=totalQuota();
    $("remainingFoot").textContent=`${tq?Math.round(rem/tq*100):0}% kapasitas masih tersedia`;
    const select=$("quotaPeriodSelect"); const current=select.value;
    select.innerHTML=data.periods.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join("");
    if(data.periods.some(p=>p.id===current))select.value=current;
    const p=periodById(select.value)||data.periods[0];
    if(p){
      const c=countsFor(p.id), quota=Number(p.quota)||0, pct=quota?Math.min(100,Math.round(c.accepted/quota*100)):0;
      $("quotaUsed").textContent=`${c.accepted} dari ${quota}`;
      $("quotaPercent").textContent=`${pct}%`;
      $("quotaProgress").style.width=`${pct}%`;
    } else {$("quotaUsed").textContent="0 dari 0";$("quotaPercent").textContent="0%";$("quotaProgress").style.width="0%";}
    $("periodSummary").innerHTML=data.periods.length?data.periods.map(p=>{const c=countsFor(p.id),q=Number(p.quota)||0,pc=q?Math.min(100,Math.round(c.accepted/q*100)):0;return `<div class="period-summary-row"><div class="period-name" title="${esc(p.name)}">${esc(p.name)}</div><div class="small-progress"><span style="width:${pc}%"></span></div><div class="period-count">${c.accepted}/${q} diterima</div></div>`}).join(""):`<div class="empty-state">Belum ada periode.</div>`;
    renderChart();
    const recent=[...data.participants].sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0)).slice(0,5);
    $("recentTable").innerHTML=recent.length?recent.map(p=>{const period=periodById(p.periodId);return `<tr><td><div class="person-cell"><div class="person-avatar">${esc(initials(p.name))}</div><div><div class="person-name">${esc(p.name)}</div><div class="person-sub">${esc(p.major||"Jurusan belum diisi")}</div></div></div></td><td>${esc(p.campus)}</td><td>${esc(period?.name||"Periode dihapus")}</td><td>${statusBadge(p.status)}</td><td><button class="action-btn" data-edit-participant="${esc(p.id)}" title="Edit"><i class="bi bi-pencil"></i></button></td></tr>`}).join(""):`<tr><td colspan="5"><div class="empty-state">Belum ada data peserta.</div></td></tr>`;
  }
  function renderChart(){
    const statusOrder=["Diterima","Menunggu","Ditolak","Selesai"];
    const counts=statusOrder.map(s=>data.participants.filter(p=>p.status===s).length);
    $("chartTotal").textContent=data.participants.length;
    $("statusLegend").innerHTML=statusOrder.map((s,i)=>`<div class="status-legend-item"><i style="background:${["#2d8656","#e4ad45","#d86c63","#7090d2"][i]}"></i><span>${s}</span><strong>${counts[i]}</strong></div>`).join("");
    const canvas=$("statusChart");
    if(!canvas || !window.Chart)return;
    if(statusChart)statusChart.destroy();
    statusChart=new Chart(canvas,{type:"doughnut",data:{labels:statusOrder,datasets:[{data:counts,backgroundColor:["#2d8656","#e4ad45","#d86c63","#7090d2"],borderWidth:0,hoverOffset:4}]},options:{responsive:true,maintainAspectRatio:false,cutout:"76%",plugins:{legend:{display:false},tooltip:{callbacks:{label:(ctx)=>`${ctx.label}: ${ctx.raw}`}}}}});
  }
  function renderPeriods(){
    const query=($("periodSearch")?.value||"").toLowerCase();
    const rows=data.periods.filter(p=>p.name.toLowerCase().includes(query));
    $("periodCount").textContent=`${data.periods.length} periode`;
    $("periodTable").innerHTML=rows.length?rows.map(p=>{const c=countsFor(p.id),q=Number(p.quota)||0,remain=Math.max(0,q-c.accepted);return `<tr><td><strong class="person-name">${esc(p.name)}</strong><div class="person-sub">${esc(p.id)}</div></td><td>${fmtDate(p.start)}</td><td>${fmtDate(p.end)}</td><td>${q}</td><td>${c.accepted}</td><td><strong class="${remain===0?'text-danger-soft':''}">${remain}</strong></td><td><span class="status-badge ${p.status==="Aktif"?"status-diterima":p.status==="Ditutup"?"status-ditolak":"status-menunggu"}">${esc(p.status)}</span></td><td><button class="action-btn" data-edit-period="${esc(p.id)}" title="Edit periode"><i class="bi bi-pencil"></i></button><button class="action-btn" data-delete-period="${esc(p.id)}" title="Hapus periode"><i class="bi bi-trash"></i></button></td></tr>`}).join(""):`<tr><td colspan="8"><div class="empty-state"><i class="bi bi-calendar-x"></i>Periode tidak ditemukan.</div></td></tr>`;
  }
  function renderParticipants(){
    const q=($("participantSearch")?.value||"").toLowerCase(), pf=$("participantPeriodFilter")?.value||"", sf=$("participantStatusFilter")?.value||"";
    const rows=data.participants.filter(p=>{const search=`${p.name} ${p.campus} ${p.major}`.toLowerCase();return search.includes(q)&&(!pf||p.periodId===pf)&&(!sf||p.status===sf)}).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));
    $("participantTotal").textContent=data.participants.length;$("participantAccepted").textContent=acceptedAll();$("participantPending").textContent=data.participants.filter(p=>p.status==="Menunggu").length;$("participantDone").textContent=data.participants.filter(p=>p.status==="Selesai").length;
    $("tableResultCount").textContent=`Menampilkan ${rows.length} dari ${data.participants.length} data`;
    $("participantTable").innerHTML=rows.length?rows.map(p=>{const period=periodById(p.periodId);return `<tr><td><div class="person-cell"><div class="person-avatar">${esc(initials(p.name))}</div><div><div class="person-name">${esc(p.name)}</div><div class="person-sub">${esc(p.id)}</div></div></div></td><td>${esc(p.campus)}</td><td>${esc(p.major||"—")}</td><td>${esc(period?.name||"Periode dihapus")}</td><td>${statusBadge(p.status)}</td><td><button class="action-btn" data-edit-participant="${esc(p.id)}" title="Edit"><i class="bi bi-pencil"></i></button><button class="action-btn" data-delete-participant="${esc(p.id)}" title="Hapus"><i class="bi bi-trash"></i></button></td></tr>`}).join(""):`<tr><td colspan="6"><div class="empty-state"><i class="bi bi-person-exclamation"></i>Tidak ada data yang cocok.</div></td></tr>`;
  }
  function renderReports(){
    $("reportPeriods").textContent=data.periods.length;$("reportQuota").textContent=totalQuota();$("reportAccepted").textContent=acceptedAll();$("reportRemaining").textContent=remainingAll();
    $("reportTable").innerHTML=data.periods.length?data.periods.map(p=>{const c=countsFor(p.id),q=Number(p.quota)||0,remain=Math.max(0,q-c.accepted),pct=q?Math.min(100,Math.round(c.accepted/q*100)):0;return `<tr><td><strong class="person-name">${esc(p.name)}</strong></td><td>${q}</td><td>${c.accepted}</td><td>${c.pending}</td><td>${c.rejected}</td><td>${c.done}</td><td>${remain}</td><td>${pct}%</td></tr>`}).join(""):`<tr><td colspan="8"><div class="empty-state">Belum ada periode.</div></td></tr>`;
  }
  function fillPeriodSelects(){
    const currentParticipant=$("participantPeriodFilter").value,currentModal=$("participantPeriod").value;
    $("participantPeriodFilter").innerHTML=`<option value="">Semua periode</option>`+data.periods.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join("");
    if(data.periods.some(p=>p.id===currentParticipant))$("participantPeriodFilter").value=currentParticipant;
    $("participantPeriod").innerHTML=data.periods.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join("");
    if(data.periods.some(p=>p.id===currentModal))$("participantPeriod").value=currentModal;
  }
  function goPage(name){
    document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${name}`));
    document.querySelectorAll("#mainNav .nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===name));
    const labels={dashboard:"Dashboard",periods:"Periode & Kuota",participants:"Data Peserta",reports:"Laporan"};
    $("pageCrumb").textContent=labels[name]||"Dashboard";$("sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"});
    if(name==="dashboard")renderDashboard();
  }
  function openParticipant(id=""){
    if(!data.periods.length){showToast("Tambahkan periode magang terlebih dahulu.");goPage("periods");return;}
    const p=data.participants.find(x=>x.id===id);
    $("participantForm").reset();$("participantId").value=p?.id||"";
    $("participantModalTitle").textContent=p?"Edit Peserta":"Tambah Peserta";
    fillPeriodSelects();
    if(p){$("participantName").value=p.name;$("participantCampus").value=p.campus;$("participantMajor").value=p.major||"";$("participantPeriod").value=p.periodId;$("participantStatus").value=p.status;}
    bootstrap.Modal.getOrCreateInstance($("participantModal")).show();
  }
  function openPeriod(id=""){
    const p=data.periods.find(x=>x.id===id);
    $("periodForm").reset();$("periodId").value=p?.id||"";
    $("periodModalTitle").textContent=p?"Edit Periode":"Tambah Periode";
    if(p){$("periodName").value=p.name;$("periodStart").value=p.start;$("periodEnd").value=p.end;$("periodQuota").value=p.quota;$("periodStatus").value=p.status;}
    else{$("periodStatus").value="Aktif";$("periodQuota").value=10;}
    bootstrap.Modal.getOrCreateInstance($("periodModal")).show();
  }
  function downloadFile(filename,content,mime="text/csv;charset=utf-8;"){
    const blob=new Blob(["\ufeff",content],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  }
  function csvCell(value){let s=String(value??"");if(/^[=+\-@\t\r]/.test(s))s="'"+s;return `"${s.replace(/"/g,'""')}"`;}
  function exportParticipants(){
    const rows=[["ID","Nama","Perguruan Tinggi","Jurusan","Periode","Status"],...data.participants.map(p=>[p.id,p.name,p.campus,p.major,periodById(p.periodId)?.name||"",p.status])];
    downloadFile("data-peserta-magang.csv",rows.map(r=>r.map(csvCell).join(",")).join("\r\n"));showToast("File CSV peserta berhasil dibuat.");
  }
  function exportReport(){
    const rows=[["Periode","Tanggal Mulai","Tanggal Selesai","Total Kuota","Diterima","Menunggu","Ditolak","Selesai","Sisa Kuota","Keterisian (%)"],...data.periods.map(p=>{const c=countsFor(p.id),q=Number(p.quota)||0;return[p.name,p.start,p.end,q,c.accepted,c.pending,c.rejected,c.done,Math.max(0,q-c.accepted),q?Math.min(100,Math.round(c.accepted/q*100)):0]})];
    downloadFile("laporan-kuota-magang.csv",rows.map(r=>r.map(csvCell).join(",")).join("\r\n"));showToast("Laporan CSV berhasil dibuat.");
  }
  function parseCSV(text){
    const rows=[];let row=[],cell="",quoted=false;
    for(let i=0;i<text.length;i++){const ch=text[i],next=text[i+1];if(ch==='"'&&quoted&&next==='"'){cell+='"';i++;}else if(ch==='"'){quoted=!quoted;}else if(ch===","&&!quoted){row.push(cell);cell="";}else if((ch==="\n"||ch==="\r")&&!quoted){if(ch==="\r"&&next==="\n")i++;row.push(cell);if(row.some(v=>v.trim()))rows.push(row);row=[];cell="";}else cell+=ch;}
    if(cell.length||row.length){row.push(cell);if(row.some(v=>v.trim()))rows.push(row);}return rows;
  }
  function normalizeHeader(h){return String(h||"").trim().toLowerCase().replace(/[\s_-]+/g,"");}
  async function importCSV(file){
    if(!file)return;
    const text=await file.text(),rows=parseCSV(text);if(rows.length<2){showToast("File CSV kosong atau formatnya tidak sesuai.");return;}
    const headers=rows.shift().map(normalizeHeader);
    const findIndex=(aliases)=>headers.findIndex(h=>aliases.includes(h));
    const ix={name:findIndex(["nama","namapeserta","namalengkap"]),campus:findIndex(["kampus","perguruantinggi","universitas","instansi"]),major:findIndex(["jurusan","prodi","programstudi"]),period:findIndex(["periode","periodemagang"]),status:findIndex(["status"])};
    if(ix.name<0||ix.campus<0){showToast("Kolom wajib CSV: Nama dan Perguruan Tinggi/Kampus.");return;}
    let added=0,skipped=0;
    for(const r of rows){
      const name=(r[ix.name]||"").trim(),campus=(r[ix.campus]||"").trim();if(!name||!campus){skipped++;continue;}
      const periodName=(ix.period>=0?r[ix.period]:"")?.trim(),period=data.periods.find(p=>p.name.toLowerCase()===String(periodName||"").toLowerCase())||data.periods[0];
      const statusRaw=ix.status>=0?(r[ix.status]||"").trim():"Menunggu",status=["Menunggu","Diterima","Ditolak","Selesai"].includes(statusRaw)?statusRaw:"Menunggu";
      if(!period){skipped++;continue;}
      const dup=data.participants.some(p=>p.name.toLowerCase()===name.toLowerCase()&&p.campus.toLowerCase()===campus.toLowerCase()&&p.periodId===period.id);
      if(dup){skipped++;continue;}
      if(["Diterima","Selesai"].includes(status)&&countsFor(period.id).accepted>=Number(period.quota)){skipped++;continue;}
      data.participants.push({id:"M"+Date.now().toString(36).toUpperCase()+Math.random().toString(36).slice(2,5).toUpperCase(),name,campus,major:ix.major>=0?(r[ix.major]||"").trim():"",periodId:period.id,status,updatedAt:Date.now()+added});added++;
    }
    renderAll();showToast(`${added} data diimpor${skipped?`, ${skipped} dilewati`:''}.`);
  }

  // Navigation and page actions
  $("mainNav").addEventListener("click",e=>{const b=e.target.closest("[data-page]");if(b)goPage(b.dataset.page);});
  document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>goPage(b.dataset.go)));
  $("mobileMenu").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
  $("quickAdd").addEventListener("click",()=>openParticipant());
  $("addParticipant").addEventListener("click",()=>openParticipant());
  $("addPeriod").addEventListener("click",()=>openPeriod());
  $("quotaPeriodSelect").addEventListener("change",renderDashboard);
  $("periodSearch").addEventListener("input",renderPeriods);
  ["participantSearch","participantPeriodFilter","participantStatusFilter"].forEach(id=>$(id).addEventListener(id==="participantSearch"?"input":"change",renderParticipants));
  $("participantTable").addEventListener("click",e=>{
    const edit=e.target.closest("[data-edit-participant]"),del=e.target.closest("[data-delete-participant]");
    if(edit)openParticipant(edit.dataset.editParticipant);
    if(del){const p=data.participants.find(x=>x.id===del.dataset.deleteParticipant);if(p&&confirm(`Hapus data peserta ${p.name}?`)){data.participants=data.participants.filter(x=>x.id!==p.id);renderAll();showToast("Data peserta dihapus.");}}
  });
  $("recentTable").addEventListener("click",e=>{const b=e.target.closest("[data-edit-participant]");if(b)openParticipant(b.dataset.editParticipant);});
  $("periodTable").addEventListener("click",e=>{
    const edit=e.target.closest("[data-edit-period]"),del=e.target.closest("[data-delete-period]");
    if(edit)openPeriod(edit.dataset.editPeriod);
    if(del){const id=del.dataset.deletePeriod,p=periodById(id),used=data.participants.some(x=>x.periodId===id);if(used){showToast("Periode tidak dapat dihapus karena masih memiliki data peserta.");return;}if(p&&confirm(`Hapus periode ${p.name}?`)){data.periods=data.periods.filter(x=>x.id!==id);renderAll();showToast("Periode dihapus.");}}
  });
  $("participantForm").addEventListener("submit",e=>{
    e.preventDefault();const id=$("participantId").value,name=$("participantName").value.trim(),campus=$("participantCampus").value.trim(),major=$("participantMajor").value.trim(),periodId=$("participantPeriod").value,status=$("participantStatus").value;
    if(!name||!campus||!periodId)return;
    const dup=data.participants.some(p=>p.id!==id&&p.name.toLowerCase()===name.toLowerCase()&&p.campus.toLowerCase()===campus.toLowerCase()&&p.periodId===periodId);if(dup){showToast("Data dengan nama, kampus, dan periode tersebut sudah ada.");return;}
    const period=periodById(periodId),acceptedCount=countsFor(periodId).accepted,old=data.participants.find(p=>p.id===id),wasCounted=old&&["Diterima","Selesai"].includes(old.status)&&old.periodId===periodId;
    if(["Diterima","Selesai"].includes(status)&&period&&acceptedCount-(wasCounted?1:0)>=Number(period.quota)){showToast("Kuota periode ini sudah penuh. Status tidak dapat diubah menjadi diterima/selesai.");return;}
    if(id){const idx=data.participants.findIndex(p=>p.id===id);if(idx>=0)data.participants[idx]={...data.participants[idx],name,campus,major,periodId,status,updatedAt:Date.now()};}
    else data.participants.push({id:"M"+Date.now().toString(36).toUpperCase(),name,campus,major,periodId,status,updatedAt:Date.now()});
    bootstrap.Modal.getOrCreateInstance($("participantModal")).hide();renderAll();showToast(id?"Data peserta diperbarui.":"Peserta berhasil ditambahkan.");
  });
  $("periodForm").addEventListener("submit",e=>{
    e.preventDefault();const id=$("periodId").value,name=$("periodName").value.trim(),start=$("periodStart").value,end=$("periodEnd").value,quota=Number($("periodQuota").value),status=$("periodStatus").value;
    if(!name||!start||!end||start>end||!Number.isInteger(quota)||quota<0){showToast("Periksa nama, tanggal, dan kuota. Tanggal mulai harus sebelum tanggal selesai.");return;}
    const dup=data.periods.some(p=>p.id!==id&&p.name.toLowerCase()===name.toLowerCase());if(dup){showToast("Nama periode sudah digunakan.");return;}
    const p=data.periods.find(x=>x.id===id);
    if(p&&quota<countsFor(id).accepted){showToast("Kuota tidak boleh lebih kecil daripada peserta yang sudah diterima/selesai.");return;}
    if(p)Object.assign(p,{name,start,end,quota,status});else data.periods.push({id:"P"+Date.now().toString(36).toUpperCase(),name,start,end,quota,status});
    bootstrap.Modal.getOrCreateInstance($("periodModal")).hide();renderAll();showToast(id?"Periode diperbarui.":"Periode berhasil ditambahkan.");
  });
  $("exportCsv").addEventListener("click",exportParticipants);$("reportExport").addEventListener("click",exportReport);
  $("importBtn").addEventListener("click",()=>$("csvFile").click());
  $("csvFile").addEventListener("change",e=>{importCSV(e.target.files?.[0]);e.target.value="";});
  $("resetDemo").addEventListener("click",()=>{if(confirm("Kembalikan seluruh data ke contoh awal? Perubahan lokal akan hilang.")){data=structuredClone(defaultData);renderAll();showToast("Data contoh dipulihkan.");goPage("dashboard");}});
  $("todayLabel").textContent=new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"});
  renderAll();
})();