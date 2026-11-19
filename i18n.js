/* ============================================================
   Planora — bahasa otomatis
   Mendeteksi negara/perangkat, lalu memilih bahasa:
   Indonesia, English, atau 中文. Bisa diganti manual di Profil.
   ============================================================ */

(function () {
  const MODE_KEY = 'planora-lang';
  const GEO_KEY = 'planora-geo';
  const GEO_TTL = 7 * 24 * 60 * 60 * 1000;
  const LANGS = {
    id: { name: 'Indonesia', locale: 'id-ID' },
    en: { name: 'English', locale: 'en-US' },
    zh: { name: '中文', locale: 'zh-CN' }
  };
  const COUNTRY_LANG = { ID: 'id', CN: 'zh', HK: 'zh', MO: 'zh', TW: 'zh' };

  const ID = {
    'app.title': '{view} — Planora',
    'nav.today': 'Hari ini',
    'nav.plan': 'Action plan',
    'nav.okr': 'OKR',
    'nav.calendar': 'Kalender',
    'nav.goals': 'Target',
    'nav.roadmap': 'Roadmap',
    'nav.newTab': 'Tab baru',
    'nav.history': 'Riwayat',
    'nav.profile': 'Profil',
    'side.mode': 'Mode',
    'side.changeInProfile': 'Ubah di profil',
    'side.workspace': 'Ruang kerja',
    'side.teamWorkspace': 'Ruang kerja tim',
    'side.openMenu': 'Buka menu',
    'side.closeMenu': 'Tutup menu',
    'side.home': 'Planora — beranda',
    'mode.personal': 'Personal',
    'mode.business': 'Business',
    'user.guest': 'Tamu',
    'user.notSignedIn': 'Belum masuk',
    'user.signIn': 'Masuk',
    'user.signOut': 'Keluar',
    'user.modeActive': 'Mode aktif {mode}. Ubah di profil.',
    'user.modeTagAria': 'Mode aktif. Ubah di profil.',
    'action.addBlock': 'Tambah blok',
    'action.newPlan': 'Rencana baru',
    'action.addAgenda': 'Tambah agenda',
    'action.newGoal': 'Target baru',
    'action.addTask': 'Tambah tugas',
    'action.addItem': 'Tambah item',
    'common.undo': 'Urungkan',
    'common.cancel': 'Batal',
    'common.save': 'Simpan',
    'common.delete': 'Hapus',
    'common.deleteForever': 'Hapus permanen',
    'common.deleteItem': 'Hapus item',
    'common.deleteName': 'Hapus {title}',
    'common.editName': 'Ubah {title}',
    'common.close': 'Tutup',
    'common.open': 'Buka',
    'common.restore': 'Kembalikan',
    'common.optional': '(opsional)',
    'common.today': 'Hari ini',
    'common.empty': 'Kosong',
    'common.active': 'Aktif',
    'common.done': 'Selesai',
    'common.notDone': 'Belum selesai',
    'common.markDone': 'Tandai selesai: {title}',
    'common.markPending': 'Tandai belum selesai: {title}',
    'greeting.morning': 'Selamat pagi',
    'greeting.afternoon': 'Selamat siang',
    'greeting.evening': 'Selamat sore',
    'greeting.night': 'Selamat malam',
    'today.kicker': 'Jadwal hari ini',
    'today.emptyHeadline': 'Belum ada blok hari ini.',
    'today.allDoneHeadline': 'Semua blok sudah beres.',
    'today.remainingHeadline': '{n} blok lagi hari ini.',
    'today.emptyLead': 'Tambahkan satu blok waktu untuk mulai menyusun harimu.',
    'today.lead': 'Mulai dari yang paling dekat, lalu lanjut ke berikutnya.',
    'today.ringLabel': '{pct}% blok selesai',
    'today.streak': '{n} hari beruntun',
    'today.scheduleTitle': 'Jadwal hari ini',
    'today.countDone': '{done}/{total}',
    'today.emptySchedule': 'Belum ada blok di jadwal hari ini.',
    'today.addBlock': 'Tambah blok waktu',
    'today.saveDay': 'Simpan ke Riwayat',
    'today.focus': 'Fokus berikutnya',
    'today.noGoalTitle': 'Belum ada target',
    'today.noGoalText': 'Target jangka panjang membuat blok harian punya arah.',
    'today.firstGoal': 'Buat target pertama',
    'today.tabsTitle': 'Tab kamu',
    'today.tabsLead': 'Tab buatanmu, mis. Jadwal projek — langsung terlihat dari hari ini.',
    'today.historyButton': 'Riwayat ({n})',
    'today.manage': 'Kelola',
    'today.noTabs': 'Belum ada tab. Buat “Jadwal projek” untuk mengatur tugas dan prioritasnya.',
    'today.createTab': 'Buat tab baru',
    'today.tabMetaNotes': 'Catatan bebas',
    'today.tabMetaComplete': 'Selesai · {type}',
    'today.tabMetaOpen': '{n} terbuka · {type}',
    'today.words': '{n} kata',
    'today.stillEmpty': 'Masih kosong',
    'today.next': 'Berikutnya',
    'today.blockTag': 'Rencana',
    'plan.kicker': 'Action plan',
    'plan.headline': 'Rencana yang sedang berjalan',
    'plan.lead': 'Pecah tujuan besar menjadi langkah yang bisa dicentang hari ini.',
    'plan.emptyTitle': 'Belum ada rencana',
    'plan.emptyLead': 'Mulai dari satu rencana, lalu tambahkan langkah kecil di dalamnya.',
    'plan.emptyCta': 'Buat rencana pertama',
    'plan.stepsCount': '{done}/{total} langkah',
    'plan.noSteps': 'Belum ada langkah di rencana ini.',
    'plan.addStep': 'Tambah langkah',
    'plan.progress': '{pct}% · {done} dari {total} langkah',
    'plan.durationChip': '{n} hari',
    'plan.daysLeft': 'Sisa {n} hari',
    'plan.dueToday': 'Jatuh tempo hari ini',
    'plan.overdue': 'Lewat {n} hari',
    'plan.dueOn': 'Target {date}',
    'plan.finish': 'Tandai selesai',
    'plan.restore': 'Kembalikan rencana',
    'plan.edit': 'Ubah rencana',
    'plan.delete': 'Hapus rencana',
    'okr.kicker': 'OKR',
    'okr.headline': 'OKR kuartal ini',
    'okr.lead': 'Hasil utama, lalu langkah kecil yang mendorongnya.',
    'cal.kicker': 'Kalender',
    'cal.headline': 'Kalender',
    'cal.lead': 'Lihat agenda per tanggal. Klik satu hari untuk membuka detailnya.',
    'cal.monthLabel': 'Kalender bulan',
    'cal.prev': 'Bulan sebelumnya',
    'cal.next': 'Bulan berikutnya',
    'cal.agendaCount': '{n} agenda',
    'cal.empty': 'Belum ada agenda di tanggal ini.',
    'cal.addAgenda': 'Tambah agenda',
    'goals.kicker': 'Target',
    'goals.headline': 'Target jangka panjang',
    'goals.lead': 'Satu arah yang jelas, dengan sisa waktu yang terlihat.',
    'goals.emptyTitle': 'Belum ada target',
    'goals.emptyLead': 'Tetapkan satu arah jangka panjang supaya langkah harian tidak terasa acak.',
    'goals.emptyCta': 'Buat target pertama',
    'goals.daysLeft': '{n} hari lagi',
    'goals.roadmapKicker': 'Roadmap',
    'goals.roadmapHeadline': 'Roadmap jangka panjang',
    'type.board': 'Papan tugas',
    'type.boardLead': 'Urutkan tugas berdasarkan prioritas. Yang tinggi selalu muncul lebih dulu.',
    'type.boardDesc': 'Tugas dengan prioritas tinggi, sedang, atau rendah.',
    'type.checklist': 'Checklist',
    'type.checklistLead': 'Daftar sederhana yang bisa dicentang satu per satu.',
    'type.checklistDesc': 'Daftar sederhana yang bisa dicentang.',
    'type.notes': 'Catatan',
    'type.notesLead': 'Ruang bebas untuk keputusan, ide, atau hasil rapat.',
    'type.notesDesc': 'Tulisan bebas yang tersimpan otomatis.',
    'prio.high': 'Tinggi',
    'prio.medium': 'Sedang',
    'prio.low': 'Rendah',
    'tab.rename': 'Ubah nama',
    'tab.archive': 'Arsipkan',
    'tab.deleteName': 'Hapus tab {name}',
    'tab.restore': 'Kembalikan tab',
    'tab.archivedKicker': 'Riwayat',
    'tab.archivedAt': 'Diarsipkan {date}. Isinya hanya bisa dibaca.',
    'tab.completeTitle': 'Semua item sudah selesai.',
    'tab.completeText': 'Simpan tab ini di Riwayat agar ruang kerjamu tetap ringkas.',
    'tab.moveToHistory': 'Pindahkan ke Riwayat',
    'tab.notesTitle': 'Catatan',
    'tab.onlyRead': 'Hanya baca',
    'tab.autosave': 'Tersimpan otomatis',
    'tab.notesSaved': 'Tersimpan',
    'tab.notesPlaceholder': 'Tulis apa saja di sini — keputusan, ide, atau hasil rapat.',
    'tab.notesHint': 'Perubahan tersimpan otomatis di peramban ini.',
    'tab.notesArchivedHint': 'Kembalikan tab jika ingin mengubah catatan ini.',
    'checklist.title': 'Checklist',
    'checklist.empty': 'Belum ada item. Tambah satu yang bisa dicentang hari ini.',
    'checklist.add': 'Tambah item',
    'board.title': 'Papan tugas',
    'board.lead': 'Prioritas menentukan urutan: tugas tinggi selalu muncul lebih dulu.',
    'board.empty': 'Belum ada tugas. Tambah satu, lalu tandai prioritasnya.',
    'board.add': 'Tambah tugas',
    'history.kicker': 'Riwayat',
    'history.headline': 'Yang sudah selesai, tetap tersimpan',
    'history.lead': 'Tab, action plan, dan jadwal yang selesai otomatis tersimpan di sini. Buka untuk membaca, kembalikan, atau pakai lagi.',
    'history.panelTitle': 'Arsip selesai',
    'history.count': '{n} entri',
    'history.filterLabel': 'Filter riwayat',
    'history.filterAll': 'Semua',
    'history.filterTabs': 'Tab',
    'history.filterPlans': 'Action plan',
    'history.filterDays': 'Jadwal',
    'history.itemCount': '{n} item',
    'history.dayCount': '{n} blok',
    'history.dayTitle': 'Jadwal {date}',
    'history.dayPanelTitle': 'Blok hari itu',
    'history.restore': 'Kembalikan',
    'history.reuseDay': 'Pakai lagi',
    'history.kindTab': 'Tab',
    'history.kindPlan': 'Action plan',
    'history.kindDay': 'Jadwal',
    'history.empty': 'Belum ada riwayat. Tab, rencana, atau jadwal yang selesai akan muncul di sini.',
    'history.noneInFilter': 'Belum ada entri untuk filter ini.',
    'history.backToday': 'Kembali ke hari ini',
    'history.title': 'Riwayat',
    'history.profileLead': 'Tab, rencana, dan jadwal yang sudah selesai.',
    'history.openAll': 'Buka semua ({n})',
    'history.emptyProfile': 'Belum ada yang selesai. Riwayat akan terisi otomatis.',
    'profile.kicker': 'Profil',
    'profile.headline': 'Data dan pengaturanmu',
    'profile.lead': 'Mode ruang kerja dan bahasa bisa diubah di sini. Setiap mode punya data sendiri.',
    'profile.account': 'Akun',
    'profile.guestNote': 'Belum masuk — data hanya tersimpan di peramban ini.',
    'profile.statBlocks': 'blok tersisa',
    'profile.statPlans': 'rencana',
    'profile.statMilestones': 'milestone',
    'profile.statGoals': 'target',
    'profile.statTabs': 'tab buatanmu',
    'profile.statHistory': 'riwayat',
    'profile.signInCta': 'Masuk atau buat akun',
    'profile.signOutCta': 'Keluar dari akun',
    'profile.modeTitle': 'Mode ruang kerja',
    'profile.modeLead': 'Pilih satu mode. Blok, rencana, target, dan tab disimpan terpisah per mode.',
    'profile.personalDesc': 'Jadwal harian, action plan, dan target pribadi.',
    'profile.businessDesc': 'OKR tim, roadmap, dan milestone kuartal.',
    'profile.tabsTitle': 'Tab buatanmu',
    'profile.tabsLead': 'Tambahkan tab untuk hal yang tidak masuk action plan, mis. Jadwal projek.',
    'profile.noTabs': 'Belum ada tab di mode ini. Mulai dari “Jadwal projek” berisi tugas dan prioritas.',
    'profile.tabOpenOf': '{open} dari {total} terbuka',
    'lang.title': 'Bahasa',
    'lang.lead': 'Bahasa mengikuti negara dan perangkatmu. Kamu bisa menggantinya kapan saja.',
    'lang.auto': 'Otomatis',
    'lang.autoDesc': 'Mengikuti lokasi: {country}',
    'lang.autoUnknown': 'Mengikuti perangkatmu',
    'lang.id': 'Indonesia',
    'lang.idDesc': 'Bahasa Indonesia',
    'lang.en': 'English',
    'lang.enDesc': 'English',
    'lang.zh': '中文',
    'lang.zhDesc': '简体中文',
    'sheet.tabTypeLabel': 'Isi tab',
    'sheet.tabKicker': 'Tab baru',
    'sheet.tabTitle': 'Buat tab sendiri',
    'sheet.tabSub': 'Pilih isi tab. Beri nama sesuai kebutuhan, mis. Jadwal projek.',
    'sheet.tabLabel': 'Nama tab',
    'sheet.tabPlaceholder': 'Mis. Jadwal projek',
    'sheet.renameTitle': 'Ubah nama tab',
    'sheet.renameSub': 'Isi dan jenis tab tidak akan berubah.',
    'sheet.priority': 'Prioritas',
    'sheet.priorityHint': 'Tugas prioritas tinggi selalu muncul paling atas.',
    'sheet.time': 'Jam',
    'sheet.timePlaceholder': '09.00',
    'sheet.timeHint': 'Format 24 jam, mis. 09.00 atau 13.30.',
    'sheet.days': 'Perkiraan waktu (hari)',
    'sheet.daysHint': 'Dipakai untuk menampilkan sisa waktu target.',
    'sheet.detail': 'Deskripsi singkat',
    'sheet.detailPlaceholder': 'Mis. apa yang membuat rencana ini penting',
    'sheet.duration': 'Durasi rencana',
    'sheet.durationHint': 'Dipakai untuk menghitung sisa waktu dan tanggal target.',
    'sheet.goalTitle': 'Target baru',
    'sheet.goalSub': 'Tentukan arah dan perkiraan waktunya.',
    'sheet.goalLabel': 'Nama target',
    'sheet.goalPlaceholder': 'Mis. Cadangan dana enam bulan',
    'sheet.planTitle': 'Rencana baru',
    'sheet.planSub': 'Satu rencana bisa berisi banyak langkah kecil. Tentukan durasinya juga.',
    'sheet.planLabel': 'Nama rencana',
    'sheet.planPlaceholder': 'Mis. Action plan kelas 8',
    'sheet.editPlanTitle': 'Ubah rencana',
    'sheet.editPlanSub': 'Perbarui nama, deskripsi, atau durasinya.',
    'sheet.stepKicker': 'Langkah rencana',
    'sheet.stepTitle': 'Tambah langkah',
    'sheet.stepLabel': 'Nama langkah',
    'sheet.stepPlaceholder': 'Mis. Minta umpan balik dua orang',
    'sheet.agendaTitle': 'Tambah agenda',
    'sheet.agendaSubToday': 'Masuk ke jadwal hari ini.',
    'sheet.agendaSub': 'Untuk {date}.',
    'sheet.agendaLabel': 'Nama agenda',
    'sheet.agendaPlaceholder': 'Mis. Sinkronisasi klien',
    'sheet.editTaskTitle': 'Ubah tugas',
    'sheet.editItemTitle': 'Ubah item',
    'sheet.taskLabel': 'Nama tugas',
    'sheet.itemLabel': 'Nama item',
    'sheet.taskTitle': 'Tambah tugas',
    'sheet.taskPlaceholder': 'Mis. Kirim draf ke klien',
    'sheet.itemTitle': 'Tambah item',
    'sheet.itemPlaceholder': 'Mis. Beli kopi',
    'sheet.taskTitleToday': 'Tambah blok waktu',
    'sheet.taskSubToday': 'Blok ini muncul di jadwal hari ini.',
    'sheet.blockLabel': 'Nama blok',
    'sheet.blockPlaceholder': 'Mis. Deep work: proposal klien',
    'unit.label': 'Satuan durasi',
    'unit.day': 'Hari',
    'unit.week': 'Minggu',
    'unit.month': 'Bulan',
    'error.titleRequired': 'Beri nama dulu sebelum menyimpan.',
    'error.timeFormat': 'Gunakan format jam seperti 09.00 atau 13.30.',
    'error.planMissing': 'Rencana tidak ditemukan.',
    'error.tabMissing': 'Tab tidak ditemukan.',
    'error.itemMissing': 'Item tidak ditemukan.',
    'confirm.deleteTabTitle': 'Hapus tab?',
    'confirm.deleteTabText': 'Tab “{name}” dan semua isinya akan dihapus permanen. Pilih Arsipkan jika masih ingin menyimpannya di Riwayat.',
    'confirm.deletePlanTitle': 'Hapus rencana?',
    'confirm.deletePlanText': 'Rencana “{name}” akan dihapus permanen.',
    'confirm.deleteGoalTitle': 'Hapus target?',
    'confirm.deleteGoalText': 'Target “{name}” akan dihapus permanen.',
    'confirm.deleteHistoryTitle': 'Hapus arsip permanen?',
    'confirm.deleteHistoryText': 'Riwayat “{name}” dan semua isinya tidak bisa dikembalikan setelah dihapus.',
    'confirm.deleteTaskTitle': 'Hapus tugas?',
    'confirm.deleteItemTitle': 'Hapus item?',
    'confirm.deleteItemText': '“{name}” akan dihapus dari tab “{tab}”.',
    'confirm.resetTitle': 'Kembalikan contoh awal?',
    'confirm.resetText': 'Semua perubahan, tab, dan Riwayat di mode ini akan diganti dengan contoh awal.',
    'confirm.resetAccept': 'Kembalikan contoh',
    'toast.agendaToday': 'Agenda masuk ke jadwal hari ini.',
    'toast.agendaAdded': 'Agenda ditambahkan ke kalender.',
    'toast.blockAdded': 'Blok ditambahkan.',
    'toast.stepAdded': 'Langkah ditambahkan.',
    'toast.planCreated': 'Rencana dibuat. Tambahkan langkahnya.',
    'toast.planUpdated': 'Rencana diperbarui.',
    'toast.goalAdded': 'Target ditambahkan.',
    'toast.tabRenamed': 'Nama tab diperbarui.',
    'toast.itemUpdated': 'Perubahan item disimpan.',
    'toast.tabCreated': 'Tab dibuat. Isinya bisa kamu atur.',
    'toast.taskAdded': 'Tugas ditambahkan.',
    'toast.itemAdded': 'Item ditambahkan.',
    'toast.tabArchived': 'Tab dipindahkan ke Riwayat.',
    'toast.planFinished': 'Rencana “{name}” disimpan di Riwayat.',
    'toast.tabAutoArchived': 'Tab “{name}” selesai dan disimpan di Riwayat.',
    'toast.planAutoArchived': 'Rencana “{name}” selesai dan disimpan di Riwayat.',
    'toast.planRestored': 'Rencana dikembalikan ke ruang kerja.',
    'toast.dayRestoreHint': 'Jadwal harian bisa dipakai lagi lewat “Pakai lagi”.',
    'toast.tabRestored': 'Tab dikembalikan ke ruang kerja.',
    'toast.dayReused': 'Blok hari itu ditambahkan ke jadwal hari ini.',
    'toast.daySaved': 'Jadwal hari ini tersimpan di Riwayat.',
    'toast.tabDeleted': 'Tab dihapus permanen.',
    'toast.planDeleted': 'Rencana dihapus.',
    'toast.goalDeleted': 'Target dihapus.',
    'toast.historyDeleted': 'Arsip dihapus permanen.',
    'toast.itemDeleted': 'Item dihapus.',
    'toast.saveFailed': 'Perubahan belum bisa disimpan.',
    'toast.resetDone': 'Contoh ruang kerja dikembalikan.',
    'toast.modeChanged': 'Mode {mode} aktif. Datanya terpisah.',
    'toast.langChanged': 'Bahasa diganti ke {lang}.',
    'foot.demo': 'Demo antarmuka — data tersimpan di peramban ini.',
    'foot.reset': 'Kembalikan contoh',
    'login.title': 'Masuk ke Planora',
    'login.subtitle': 'Pilih cara kamu bekerja, lalu masuk ke ruang kerjamu.',
    'login.registerTitle': 'Buat akun Planora',
    'login.registerSubtitle': 'Pilih mode, isi datamu, dan mulai menyusun rencana pertamamu.',
    'login.submit': 'Masuk',
    'login.registerSubmit': 'Buat Akun',
    'login.switchNoAccount': 'Belum punya akun?',
    'login.switchSignup': 'Daftar sekarang.',
    'login.switchHaveAccount': 'Sudah punya akun?',
    'login.switchSignin': 'Masuk sekarang.',
    'login.forgotDemo': 'Ini demo antarmuka, jadi belum ada email pemulihan. Kamu bisa memakai akun demo apa pun atau masuk tanpa akun.',
    'login.show': 'Lihat',
    'login.hide': 'Sembunyikan',
    'login.showAria': 'Tampilkan kata sandi',
    'login.hideAria': 'Sembunyikan kata sandi',
    'login.processing': 'Memproses…'
  };

  const EN = {
    'app.title': '{view} — Planora',
    'nav.today': 'Today',
    'nav.plan': 'Action plan',
    'nav.okr': 'OKRs',
    'nav.calendar': 'Calendar',
    'nav.goals': 'Goals',
    'nav.roadmap': 'Roadmap',
    'nav.newTab': 'New tab',
    'nav.history': 'History',
    'nav.profile': 'Profile',
    'side.mode': 'Mode',
    'side.changeInProfile': 'Change in profile',
    'side.workspace': 'Workspace',
    'side.teamWorkspace': 'Team workspace',
    'side.openMenu': 'Open menu',
    'side.closeMenu': 'Close menu',
    'side.home': 'Planora — home',
    'mode.personal': 'Personal',
    'mode.business': 'Business',
    'user.guest': 'Guest',
    'user.notSignedIn': 'Not signed in',
    'user.signIn': 'Sign in',
    'user.signOut': 'Sign out',
    'user.modeActive': 'Active mode {mode}. Change it in your profile.',
    'user.modeTagAria': 'Active mode. Change it in your profile.',
    'action.addBlock': 'Add block',
    'action.newPlan': 'New plan',
    'action.addAgenda': 'Add event',
    'action.newGoal': 'New goal',
    'action.addTask': 'Add task',
    'action.addItem': 'Add item',
    'common.undo': 'Undo',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.deleteForever': 'Delete forever',
    'common.deleteItem': 'Delete item',
    'common.deleteName': 'Delete {title}',
    'common.editName': 'Edit {title}',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.restore': 'Restore',
    'common.optional': '(optional)',
    'common.today': 'Today',
    'common.empty': 'Empty',
    'common.active': 'Active',
    'common.done': 'Done',
    'common.notDone': 'Not done',
    'common.markDone': 'Mark complete: {title}',
    'common.markPending': 'Mark incomplete: {title}',
    'greeting.morning': 'Good morning',
    'greeting.afternoon': 'Good afternoon',
    'greeting.evening': 'Good evening',
    'greeting.night': 'Good night',
    'today.kicker': "Today’s schedule",
    'today.emptyHeadline': 'No blocks yet today.',
    'today.allDoneHeadline': 'Every block is done.',
    'today.remainingHeadline': '{n} left today.',
    'today.emptyLead': 'Add one time block to start shaping your day.',
    'today.lead': 'Start with the nearest one, then move on to the next.',
    'today.ringLabel': '{pct}% of blocks complete',
    'today.streak': '{n}-day streak',
    'today.scheduleTitle': "Today’s schedule",
    'today.countDone': '{done}/{total}',
    'today.emptySchedule': 'No blocks in today’s schedule yet.',
    'today.addBlock': 'Add a time block',
    'today.saveDay': 'Save to History',
    'today.focus': 'Next focus',
    'today.noGoalTitle': 'No goals yet',
    'today.noGoalText': 'Long-term goals give your daily blocks a direction.',
    'today.firstGoal': 'Create your first goal',
    'today.tabsTitle': 'Your tabs',
    'today.tabsLead': 'Tabs you created, like Project schedule — visible right from today.',
    'today.historyButton': 'History ({n})',
    'today.manage': 'Manage',
    'today.noTabs': 'No tabs yet. Create “Project schedule” to organise tasks and priorities.',
    'today.createTab': 'Create a tab',
    'today.tabMetaNotes': 'Free notes',
    'today.tabMetaComplete': 'Done · {type}',
    'today.tabMetaOpen': '{n} open · {type}',
    'today.words': '{n} words',
    'today.stillEmpty': 'Still empty',
    'today.next': 'Next',
    'today.blockTag': 'Plan',
    'plan.kicker': 'Action plan',
    'plan.headline': 'Plans in motion',
    'plan.lead': 'Break big goals into steps you can tick off today.',
    'plan.emptyTitle': 'No plans yet',
    'plan.emptyLead': 'Start with one plan, then add small steps inside it.',
    'plan.emptyCta': 'Create your first plan',
    'plan.stepsCount': '{done}/{total} steps',
    'plan.noSteps': 'No steps in this plan yet.',
    'plan.addStep': 'Add step',
    'plan.progress': '{pct}% · {done} of {total} steps',
    'plan.durationChip': '{n} days',
    'plan.daysLeft': '{n} days left',
    'plan.dueToday': 'Due today',
    'plan.overdue': '{n} days late',
    'plan.dueOn': 'Due {date}',
    'plan.finish': 'Mark as finished',
    'plan.restore': 'Restore plan',
    'plan.edit': 'Edit plan',
    'plan.delete': 'Delete plan',
    'okr.kicker': 'OKRs',
    'okr.headline': 'This quarter’s OKRs',
    'okr.lead': 'Key results first, then the small steps that move them.',
    'cal.kicker': 'Calendar',
    'cal.headline': 'Calendar',
    'cal.lead': 'See events by date. Pick a day to open its details.',
    'cal.monthLabel': 'Month calendar',
    'cal.prev': 'Previous month',
    'cal.next': 'Next month',
    'cal.agendaCount': '{n} events',
    'cal.empty': 'No events on this date yet.',
    'cal.addAgenda': 'Add event',
    'goals.kicker': 'Goals',
    'goals.headline': 'Long-term goals',
    'goals.lead': 'One clear direction, with the time left in view.',
    'goals.emptyTitle': 'No goals yet',
    'goals.emptyLead': 'Set one long-term direction so daily steps do not feel random.',
    'goals.emptyCta': 'Create your first goal',
    'goals.daysLeft': '{n} days left',
    'goals.roadmapKicker': 'Roadmap',
    'goals.roadmapHeadline': 'Long-term roadmap',
    'type.board': 'Task board',
    'type.boardLead': 'Order tasks by priority. High priority always comes first.',
    'type.boardDesc': 'Tasks with high, medium, or low priority.',
    'type.checklist': 'Checklist',
    'type.checklistLead': 'A simple list you can tick off one by one.',
    'type.checklistDesc': 'A simple list you can check off.',
    'type.notes': 'Notes',
    'type.notesLead': 'A free space for decisions, ideas, or meeting notes.',
    'type.notesDesc': 'Free text that saves automatically.',
    'prio.high': 'High',
    'prio.medium': 'Medium',
    'prio.low': 'Low',
    'tab.rename': 'Rename',
    'tab.archive': 'Archive',
    'tab.deleteName': 'Delete tab {name}',
    'tab.restore': 'Restore tab',
    'tab.archivedKicker': 'History',
    'tab.archivedAt': 'Archived {date}. This is read-only.',
    'tab.completeTitle': 'Every item is done.',
    'tab.completeText': 'Save this tab to History to keep your workspace tidy.',
    'tab.moveToHistory': 'Move to History',
    'tab.notesTitle': 'Notes',
    'tab.onlyRead': 'Read only',
    'tab.autosave': 'Saved automatically',
    'tab.notesSaved': 'Saved',
    'tab.notesPlaceholder': 'Write anything here — decisions, ideas, or meeting notes.',
    'tab.notesHint': 'Changes are saved automatically in this browser.',
    'tab.notesArchivedHint': 'Restore this tab if you want to edit the notes.',
    'checklist.title': 'Checklist',
    'checklist.empty': 'No items yet. Add one you can tick off today.',
    'checklist.add': 'Add item',
    'board.title': 'Task board',
    'board.lead': 'Priority sets the order: high-priority tasks always come first.',
    'board.empty': 'No tasks yet. Add one, then set its priority.',
    'board.add': 'Add task',
    'history.kicker': 'History',
    'history.headline': 'Finished work, still saved',
    'history.lead': 'Finished tabs, action plans, and daily schedules are saved here automatically. Open, restore, or reuse them.',
    'history.panelTitle': 'Completed archive',
    'history.count': '{n} entries',
    'history.filterLabel': 'History filter',
    'history.filterAll': 'All',
    'history.filterTabs': 'Tabs',
    'history.filterPlans': 'Action plans',
    'history.filterDays': 'Schedules',
    'history.itemCount': '{n} items',
    'history.dayCount': '{n} blocks',
    'history.dayTitle': 'Schedule for {date}',
    'history.dayPanelTitle': 'Blocks from that day',
    'history.restore': 'Restore',
    'history.reuseDay': 'Use again',
    'history.kindTab': 'Tab',
    'history.kindPlan': 'Action plan',
    'history.kindDay': 'Schedule',
    'history.empty': 'No history yet. Finished tabs, plans, or schedules will appear here.',
    'history.noneInFilter': 'No entries for this filter.',
    'history.backToday': 'Back to today',
    'history.title': 'History',
    'history.profileLead': 'Tabs, plans, and schedules you have finished.',
    'history.openAll': 'Open all ({n})',
    'history.emptyProfile': 'Nothing finished yet. History fills up automatically.',
    'profile.kicker': 'Profile',
    'profile.headline': 'Your data and settings',
    'profile.lead': 'Change workspace mode and language here. Each mode keeps its own data.',
    'profile.account': 'Account',
    'profile.guestNote': 'Not signed in — data stays in this browser only.',
    'profile.statBlocks': 'blocks left',
    'profile.statPlans': 'plans',
    'profile.statMilestones': 'milestones',
    'profile.statGoals': 'goals',
    'profile.statTabs': 'your tabs',
    'profile.statHistory': 'history',
    'profile.signInCta': 'Sign in or create an account',
    'profile.signOutCta': 'Sign out',
    'profile.modeTitle': 'Workspace mode',
    'profile.modeLead': 'Pick one mode. Blocks, plans, goals, and tabs are stored separately per mode.',
    'profile.personalDesc': 'Daily schedule, action plans, and personal goals.',
    'profile.businessDesc': 'Team OKRs, roadmap, and quarterly milestones.',
    'profile.tabsTitle': 'Your tabs',
    'profile.tabsLead': 'Add tabs for things outside your action plan, like a project schedule.',
    'profile.noTabs': 'No tabs in this mode. Start with “Project schedule” for tasks and priorities.',
    'profile.tabOpenOf': '{open} of {total} open',
    'lang.title': 'Language',
    'lang.lead': 'Language follows your country and device. You can change it anytime.',
    'lang.auto': 'Automatic',
    'lang.autoDesc': 'Following your location: {country}',
    'lang.autoUnknown': 'Following your device',
    'lang.id': 'Indonesia',
    'lang.idDesc': 'Bahasa Indonesia',
    'lang.en': 'English',
    'lang.enDesc': 'English',
    'lang.zh': '中文',
    'lang.zhDesc': '简体中文',
    'sheet.tabTypeLabel': 'Tab content',
    'sheet.tabKicker': 'New tab',
    'sheet.tabTitle': 'Create your own tab',
    'sheet.tabSub': 'Pick the content type. Name it as you like, e.g. Project schedule.',
    'sheet.tabLabel': 'Tab name',
    'sheet.tabPlaceholder': 'e.g. Project schedule',
    'sheet.renameTitle': 'Rename tab',
    'sheet.renameSub': 'The tab content and type stay the same.',
    'sheet.priority': 'Priority',
    'sheet.priorityHint': 'High-priority tasks always appear at the top.',
    'sheet.time': 'Time',
    'sheet.timePlaceholder': '09:00',
    'sheet.timeHint': '24-hour format, e.g. 09.00 or 13.30.',
    'sheet.days': 'Estimated time (days)',
    'sheet.daysHint': 'Used to show the time left for the goal.',
    'sheet.detail': 'Short description',
    'sheet.detailPlaceholder': 'e.g. why this plan matters',
    'sheet.duration': 'Plan duration',
    'sheet.durationHint': 'Used to calculate time left and the target date.',
    'sheet.goalTitle': 'New goal',
    'sheet.goalSub': 'Set the direction and an estimated timeframe.',
    'sheet.goalLabel': 'Goal name',
    'sheet.goalPlaceholder': 'e.g. Six months of savings',
    'sheet.planTitle': 'New plan',
    'sheet.planSub': 'One plan can hold many small steps. Set its duration too.',
    'sheet.planLabel': 'Plan name',
    'sheet.planPlaceholder': 'e.g. Grade 8 action plan',
    'sheet.editPlanTitle': 'Edit plan',
    'sheet.editPlanSub': 'Update the name, description, or duration.',
    'sheet.stepKicker': 'Plan step',
    'sheet.stepTitle': 'Add step',
    'sheet.stepLabel': 'Step name',
    'sheet.stepPlaceholder': 'e.g. Ask two people for feedback',
    'sheet.agendaTitle': 'Add event',
    'sheet.agendaSubToday': 'This goes into today’s schedule.',
    'sheet.agendaSub': 'For {date}.',
    'sheet.agendaLabel': 'Event name',
    'sheet.agendaPlaceholder': 'e.g. Client sync',
    'sheet.editTaskTitle': 'Edit task',
    'sheet.editItemTitle': 'Edit item',
    'sheet.taskLabel': 'Task name',
    'sheet.itemLabel': 'Item name',
    'sheet.taskTitle': 'Add task',
    'sheet.taskPlaceholder': 'e.g. Send the draft to the client',
    'sheet.itemTitle': 'Add item',
    'sheet.itemPlaceholder': 'e.g. Buy coffee',
    'sheet.taskTitleToday': 'Add time block',
    'sheet.taskSubToday': 'This block appears in today’s schedule.',
    'sheet.blockLabel': 'Block name',
    'sheet.blockPlaceholder': 'e.g. Deep work: client proposal',
    'unit.label': 'Duration unit',
    'unit.day': 'Days',
    'unit.week': 'Weeks',
    'unit.month': 'Months',
    'error.titleRequired': 'Give it a name before saving.',
    'error.timeFormat': 'Use a time like 09.00 or 13.30.',
    'error.planMissing': 'Plan not found.',
    'error.tabMissing': 'Tab not found.',
    'error.itemMissing': 'Item not found.',
    'confirm.deleteTabTitle': 'Delete tab?',
    'confirm.deleteTabText': 'The tab “{name}” and everything in it will be deleted permanently. Choose Archive if you want to keep it in History.',
    'confirm.deletePlanTitle': 'Delete plan?',
    'confirm.deletePlanText': 'The plan “{name}” will be deleted permanently.',
    'confirm.deleteGoalTitle': 'Delete goal?',
    'confirm.deleteGoalText': 'The goal “{name}” will be deleted permanently.',
    'confirm.deleteHistoryTitle': 'Delete archive permanently?',
    'confirm.deleteHistoryText': 'The history entry “{name}” cannot be recovered once deleted.',
    'confirm.deleteTaskTitle': 'Delete task?',
    'confirm.deleteItemTitle': 'Delete item?',
    'confirm.deleteItemText': '“{name}” will be removed from the tab “{tab}”.',
    'confirm.resetTitle': 'Restore the starting sample?',
    'confirm.resetText': 'All changes, tabs, and History in this mode will be replaced with the starting sample.',
    'confirm.resetAccept': 'Restore sample',
    'toast.agendaToday': 'Event added to today’s schedule.',
    'toast.agendaAdded': 'Event added to the calendar.',
    'toast.blockAdded': 'Block added.',
    'toast.stepAdded': 'Step added.',
    'toast.planCreated': 'Plan created. Now add its steps.',
    'toast.planUpdated': 'Plan updated.',
    'toast.goalAdded': 'Goal added.',
    'toast.tabRenamed': 'Tab renamed.',
    'toast.itemUpdated': 'Item changes saved.',
    'toast.tabCreated': 'Tab created. You can fill it in now.',
    'toast.taskAdded': 'Task added.',
    'toast.itemAdded': 'Item added.',
    'toast.tabArchived': 'Tab moved to History.',
    'toast.planFinished': 'Plan “{name}” saved to History.',
    'toast.tabAutoArchived': 'Tab “{name}” is done and saved to History.',
    'toast.planAutoArchived': 'Plan “{name}” is done and saved to History.',
    'toast.planRestored': 'Plan restored to the workspace.',
    'toast.dayRestoreHint': 'Use “Use again” to bring a daily schedule back.',
    'toast.tabRestored': 'Tab restored to the workspace.',
    'toast.dayReused': 'That day’s blocks were added to today.',
    'toast.daySaved': 'Today’s schedule saved to History.',
    'toast.tabDeleted': 'Tab deleted permanently.',
    'toast.planDeleted': 'Plan deleted.',
    'toast.goalDeleted': 'Goal deleted.',
    'toast.historyDeleted': 'Archive deleted permanently.',
    'toast.itemDeleted': 'Item deleted.',
    'toast.saveFailed': 'Changes could not be saved yet.',
    'toast.resetDone': 'Workspace restored to the sample.',
    'toast.modeChanged': 'Mode {mode} is active. Its data is separate.',
    'toast.langChanged': 'Language changed to {lang}.',
    'foot.demo': 'Interface demo — data is stored in this browser.',
    'foot.reset': 'Restore sample',
    'login.title': 'Sign in to Planora',
    'login.subtitle': 'Choose how you work, then step into your workspace.',
    'login.registerTitle': 'Create a Planora account',
    'login.registerSubtitle': 'Pick a mode, fill in your details, and start your first plan.',
    'login.submit': 'Sign in',
    'login.registerSubmit': 'Create account',
    'login.switchNoAccount': 'Don’t have an account?',
    'login.switchSignup': 'Sign up now.',
    'login.switchHaveAccount': 'Already have an account?',
    'login.switchSignin': 'Sign in now.',
    'login.forgotDemo': 'This is an interface demo, so there is no recovery email yet. Use any demo account or continue without one.',
    'login.show': 'Show',
    'login.hide': 'Hide',
    'login.showAria': 'Show password',
    'login.hideAria': 'Hide password',
    'login.processing': 'Processing…'
  };

  const ZH = {
    'app.title': '{view} — Planora',
    'nav.today': '今天',
    'nav.plan': '行动计划',
    'nav.okr': 'OKR',
    'nav.calendar': '日历',
    'nav.goals': '目标',
    'nav.roadmap': '路线图',
    'nav.newTab': '新建标签',
    'nav.history': '历史',
    'nav.profile': '个人资料',
    'side.mode': '模式',
    'side.changeInProfile': '在个人资料中更改',
    'side.workspace': '工作区',
    'side.teamWorkspace': '团队工作区',
    'side.openMenu': '打开菜单',
    'side.closeMenu': '关闭菜单',
    'side.home': 'Planora — 首页',
    'mode.personal': '个人',
    'mode.business': '商务',
    'user.guest': '访客',
    'user.notSignedIn': '未登录',
    'user.signIn': '登录',
    'user.signOut': '退出',
    'user.modeActive': '当前模式：{mode}。可在个人资料中更改。',
    'user.modeTagAria': '当前模式。可在个人资料中更改。',
    'action.addBlock': '添加时间块',
    'action.newPlan': '新建计划',
    'action.addAgenda': '添加日程',
    'action.newGoal': '新建目标',
    'action.addTask': '添加任务',
    'action.addItem': '添加条目',
    'common.undo': '撤销',
    'common.cancel': '取消',
    'common.save': '保存',
    'common.delete': '删除',
    'common.deleteForever': '永久删除',
    'common.deleteItem': '删除条目',
    'common.deleteName': '删除 {title}',
    'common.editName': '编辑 {title}',
    'common.close': '关闭',
    'common.open': '打开',
    'common.restore': '恢复',
    'common.optional': '（可选）',
    'common.today': '今天',
    'common.empty': '空',
    'common.active': '使用中',
    'common.done': '已完成',
    'common.notDone': '未完成',
    'common.markDone': '标记完成：{title}',
    'common.markPending': '标记未完成：{title}',
    'greeting.morning': '早上好',
    'greeting.afternoon': '下午好',
    'greeting.evening': '晚上好',
    'greeting.night': '晚安',
    'today.kicker': '今日日程',
    'today.emptyHeadline': '今天还没有时间块。',
    'today.allDoneHeadline': '所有时间块都完成了。',
    'today.remainingHeadline': '今天还剩 {n} 项。',
    'today.emptyLead': '添加一个时间块，开始规划你的一天。',
    'today.lead': '从最近的一项开始，然后继续下一项。',
    'today.ringLabel': '已完成 {pct}% 的时间块',
    'today.streak': '连续 {n} 天',
    'today.scheduleTitle': '今日日程',
    'today.countDone': '{done}/{total}',
    'today.emptySchedule': '今天还没有安排时间块。',
    'today.addBlock': '添加时间块',
    'today.saveDay': '保存到历史',
    'today.focus': '下一个重点',
    'today.noGoalTitle': '还没有目标',
    'today.noGoalText': '长期目标让每天的时间块有方向。',
    'today.firstGoal': '创建第一个目标',
    'today.tabsTitle': '你的标签',
    'today.tabsLead': '你创建的标签，例如「项目日程」——今天就能看到。',
    'today.historyButton': '历史（{n}）',
    'today.manage': '管理',
    'today.noTabs': '还没有标签。创建「项目日程」来整理任务和优先级。',
    'today.createTab': '新建标签',
    'today.tabMetaNotes': '自由笔记',
    'today.tabMetaComplete': '已完成 · {type}',
    'today.tabMetaOpen': '{n} 项未完成 · {type}',
    'today.words': '{n} 字',
    'today.stillEmpty': '还是空的',
    'today.next': '下一个',
    'today.blockTag': '计划',
    'plan.kicker': '行动计划',
    'plan.headline': '进行中的计划',
    'plan.lead': '把大目标拆成今天就能勾选的步骤。',
    'plan.emptyTitle': '还没有计划',
    'plan.emptyLead': '先创建一个计划，再在里面添加小步骤。',
    'plan.emptyCta': '创建第一个计划',
    'plan.stepsCount': '{done}/{total} 个步骤',
    'plan.noSteps': '这个计划还没有步骤。',
    'plan.addStep': '添加步骤',
    'plan.progress': '{pct}% · {done}/{total} 个步骤',
    'plan.durationChip': '{n} 天',
    'plan.daysLeft': '还剩 {n} 天',
    'plan.dueToday': '今天到期',
    'plan.overdue': '已逾期 {n} 天',
    'plan.dueOn': '目标日期 {date}',
    'plan.finish': '标记完成',
    'plan.restore': '恢复计划',
    'plan.edit': '编辑计划',
    'plan.delete': '删除计划',
    'okr.kicker': 'OKR',
    'okr.headline': '本季度 OKR',
    'okr.lead': '先定关键结果，再用小步骤推动它。',
    'cal.kicker': '日历',
    'cal.headline': '日历',
    'cal.lead': '按日期查看日程。点击某一天查看详情。',
    'cal.monthLabel': '月历',
    'cal.prev': '上个月',
    'cal.next': '下个月',
    'cal.agendaCount': '{n} 个日程',
    'cal.empty': '这一天还没有日程。',
    'cal.addAgenda': '添加日程',
    'goals.kicker': '目标',
    'goals.headline': '长期目标',
    'goals.lead': '一个清晰的方向，以及看得见的剩余时间。',
    'goals.emptyTitle': '还没有目标',
    'goals.emptyLead': '设定一个长期方向，让每天的步骤不再零散。',
    'goals.emptyCta': '创建第一个目标',
    'goals.daysLeft': '还剩 {n} 天',
    'goals.roadmapKicker': '路线图',
    'goals.roadmapHeadline': '长期路线图',
    'type.board': '任务看板',
    'type.boardLead': '按优先级排列任务，高优先级永远在最前。',
    'type.boardDesc': '高、中、低优先级的任务。',
    'type.checklist': '清单',
    'type.checklistLead': '可以逐项勾选的简单列表。',
    'type.checklistDesc': '可以逐项勾选的简单列表。',
    'type.notes': '笔记',
    'type.notesLead': '记录决定、想法或会议结果的自由空间。',
    'type.notesDesc': '自动保存的自由文字。',
    'prio.high': '高',
    'prio.medium': '中',
    'prio.low': '低',
    'tab.rename': '重命名',
    'tab.archive': '归档',
    'tab.deleteName': '删除标签 {name}',
    'tab.restore': '恢复标签',
    'tab.archivedKicker': '历史',
    'tab.archivedAt': '归档于 {date}。仅可阅读。',
    'tab.completeTitle': '所有条目都完成了。',
    'tab.completeText': '把这个标签保存到历史，让工作区保持清爽。',
    'tab.moveToHistory': '移到历史',
    'tab.notesTitle': '笔记',
    'tab.onlyRead': '只读',
    'tab.autosave': '自动保存',
    'tab.notesSaved': '已保存',
    'tab.notesPlaceholder': '在这里写下任何内容——决定、想法或会议记录。',
    'tab.notesHint': '更改会自动保存在此浏览器中。',
    'tab.notesArchivedHint': '恢复标签后即可编辑笔记。',
    'checklist.title': '清单',
    'checklist.empty': '还没有条目。添加一个今天就能完成的。',
    'checklist.add': '添加条目',
    'board.title': '任务看板',
    'board.lead': '优先级决定顺序：高优先级任务永远在最前。',
    'board.empty': '还没有任务。添加一个并设置优先级。',
    'board.add': '添加任务',
    'history.kicker': '历史',
    'history.headline': '完成的事，依然留存',
    'history.lead': '完成的标签、行动计划和日程会自动保存在这里。可以打开、恢复或再次使用。',
    'history.panelTitle': '完成归档',
    'history.count': '{n} 条',
    'history.filterLabel': '历史筛选',
    'history.filterAll': '全部',
    'history.filterTabs': '标签',
    'history.filterPlans': '行动计划',
    'history.filterDays': '日程',
    'history.itemCount': '{n} 个条目',
    'history.dayCount': '{n} 个时间块',
    'history.dayTitle': '{date} 的日程',
    'history.dayPanelTitle': '当天的时间块',
    'history.restore': '恢复',
    'history.reuseDay': '再次使用',
    'history.kindTab': '标签',
    'history.kindPlan': '行动计划',
    'history.kindDay': '日程',
    'history.empty': '还没有历史。完成的标签、计划或日程会出现在这里。',
    'history.noneInFilter': '此筛选下没有条目。',
    'history.backToday': '回到今天',
    'history.title': '历史',
    'history.profileLead': '你已完成的标签、计划和日程。',
    'history.openAll': '全部打开（{n}）',
    'history.emptyProfile': '还没有完成的内容。历史会自动填充。',
    'profile.kicker': '个人资料',
    'profile.headline': '你的数据与设置',
    'profile.lead': '在这里更改工作区模式和语言。每种模式的数据独立。',
    'profile.account': '账户',
    'profile.guestNote': '未登录——数据仅保存在此浏览器中。',
    'profile.statBlocks': '个剩余时间块',
    'profile.statPlans': '个计划',
    'profile.statMilestones': '个里程碑',
    'profile.statGoals': '个目标',
    'profile.statTabs': '个标签',
    'profile.statHistory': '条历史',
    'profile.signInCta': '登录或创建账户',
    'profile.signOutCta': '退出账户',
    'profile.modeTitle': '工作区模式',
    'profile.modeLead': '选择一种模式。时间块、计划、目标和标签按模式分开保存。',
    'profile.personalDesc': '每日日程、行动计划和个人目标。',
    'profile.businessDesc': '团队 OKR、路线图和季度里程碑。',
    'profile.tabsTitle': '你的标签',
    'profile.tabsLead': '为行动计划之外的事添加标签，例如项目日程。',
    'profile.noTabs': '此模式还没有标签。从包含任务和优先级的「项目日程」开始。',
    'profile.tabOpenOf': '{open}/{total} 项未完成',
    'lang.title': '语言',
    'lang.lead': '语言会根据你的国家和设备自动选择，也可以随时更改。',
    'lang.auto': '自动',
    'lang.autoDesc': '跟随位置：{country}',
    'lang.autoUnknown': '跟随你的设备',
    'lang.id': '印度尼西亚语',
    'lang.idDesc': 'Bahasa Indonesia',
    'lang.en': '英语',
    'lang.enDesc': 'English',
    'lang.zh': '中文',
    'lang.zhDesc': '简体中文',
    'sheet.tabTypeLabel': '标签内容',
    'sheet.tabKicker': '新标签',
    'sheet.tabTitle': '创建自己的标签',
    'sheet.tabSub': '选择内容类型，并按需要命名，例如「项目日程」。',
    'sheet.tabLabel': '标签名称',
    'sheet.tabPlaceholder': '例如：项目日程',
    'sheet.renameTitle': '重命名标签',
    'sheet.renameSub': '标签的内容和类型不会改变。',
    'sheet.priority': '优先级',
    'sheet.priorityHint': '高优先级任务总是显示在最上方。',
    'sheet.time': '时间',
    'sheet.timePlaceholder': '09:00',
    'sheet.timeHint': '24 小时制，例如 09.00 或 13.30。',
    'sheet.days': '预计时间（天）',
    'sheet.daysHint': '用于显示目标剩余时间。',
    'sheet.detail': '简短说明',
    'sheet.detailPlaceholder': '例如：这个计划为什么重要',
    'sheet.duration': '计划时长',
    'sheet.durationHint': '用于计算剩余时间和目标日期。',
    'sheet.goalTitle': '新目标',
    'sheet.goalSub': '设定方向并估计所需时间。',
    'sheet.goalLabel': '目标名称',
    'sheet.goalPlaceholder': '例如：六个月储备金',
    'sheet.planTitle': '新计划',
    'sheet.planSub': '一个计划可以包含很多小步骤，也可以设定时长。',
    'sheet.planLabel': '计划名称',
    'sheet.planPlaceholder': '例如：八年级行动计划',
    'sheet.editPlanTitle': '编辑计划',
    'sheet.editPlanSub': '更新名称、说明或时长。',
    'sheet.stepKicker': '计划步骤',
    'sheet.stepTitle': '添加步骤',
    'sheet.stepLabel': '步骤名称',
    'sheet.stepPlaceholder': '例如：请两个人给反馈',
    'sheet.agendaTitle': '添加日程',
    'sheet.agendaSubToday': '将加入今日日程。',
    'sheet.agendaSub': '用于 {date}。',
    'sheet.agendaLabel': '日程名称',
    'sheet.agendaPlaceholder': '例如：客户同步',
    'sheet.editTaskTitle': '编辑任务',
    'sheet.editItemTitle': '编辑条目',
    'sheet.taskLabel': '任务名称',
    'sheet.itemLabel': '条目名称',
    'sheet.taskTitle': '添加任务',
    'sheet.taskPlaceholder': '例如：把草稿发给客户',
    'sheet.itemTitle': '添加条目',
    'sheet.itemPlaceholder': '例如：买咖啡',
    'sheet.taskTitleToday': '添加时间块',
    'sheet.taskSubToday': '这个时间块会出现在今日日程中。',
    'sheet.blockLabel': '时间块名称',
    'sheet.blockPlaceholder': '例如：深度工作：客户提案',
    'unit.label': '时长单位',
    'unit.day': '天',
    'unit.week': '周',
    'unit.month': '个月',
    'error.titleRequired': '保存前请先命名。',
    'error.timeFormat': '请使用 09.00 或 13.30 这样的时间格式。',
    'error.planMissing': '找不到计划。',
    'error.tabMissing': '找不到标签。',
    'error.itemMissing': '找不到条目。',
    'confirm.deleteTabTitle': '删除标签？',
    'confirm.deleteTabText': '标签「{name}」及其所有内容将被永久删除。如果想保留在历史中，请选择归档。',
    'confirm.deletePlanTitle': '删除计划？',
    'confirm.deletePlanText': '计划「{name}」将被永久删除。',
    'confirm.deleteGoalTitle': '删除目标？',
    'confirm.deleteGoalText': '目标「{name}」将被永久删除。',
    'confirm.deleteHistoryTitle': '永久删除归档？',
    'confirm.deleteHistoryText': '历史「{name}」删除后无法恢复。',
    'confirm.deleteTaskTitle': '删除任务？',
    'confirm.deleteItemTitle': '删除条目？',
    'confirm.deleteItemText': '「{name}」将从标签「{tab}」中删除。',
    'confirm.resetTitle': '恢复初始示例？',
    'confirm.resetText': '此模式下的所有更改、标签和历史都将被初始示例替换。',
    'confirm.resetAccept': '恢复示例',
    'toast.agendaToday': '日程已加入今日安排。',
    'toast.agendaAdded': '日程已添加到日历。',
    'toast.blockAdded': '时间块已添加。',
    'toast.stepAdded': '步骤已添加。',
    'toast.planCreated': '计划已创建，现在添加步骤吧。',
    'toast.planUpdated': '计划已更新。',
    'toast.goalAdded': '目标已添加。',
    'toast.tabRenamed': '标签已重命名。',
    'toast.itemUpdated': '条目更改已保存。',
    'toast.tabCreated': '标签已创建，可以开始添加内容了。',
    'toast.taskAdded': '任务已添加。',
    'toast.itemAdded': '条目已添加。',
    'toast.tabArchived': '标签已移到历史。',
    'toast.planFinished': '计划「{name}」已保存到历史。',
    'toast.tabAutoArchived': '标签「{name}」已完成并保存到历史。',
    'toast.planAutoArchived': '计划「{name}」已完成并保存到历史。',
    'toast.planRestored': '计划已恢复到工作区。',
    'toast.dayRestoreHint': '日程可以通过「再次使用」重新加入。',
    'toast.tabRestored': '标签已恢复到工作区。',
    'toast.dayReused': '当天的时块已加入今天。',
    'toast.daySaved': '今日日程已保存到历史。',
    'toast.tabDeleted': '标签已永久删除。',
    'toast.planDeleted': '计划已删除。',
    'toast.goalDeleted': '目标已删除。',
    'toast.historyDeleted': '归档已永久删除。',
    'toast.itemDeleted': '条目已删除。',
    'toast.saveFailed': '暂时无法保存更改。',
    'toast.resetDone': '工作区已恢复为示例。',
    'toast.modeChanged': '{mode}模式已启用，数据相互独立。',
    'toast.langChanged': '语言已切换为 {lang}。',
    'foot.demo': '界面演示——数据保存在此浏览器中。',
    'foot.reset': '恢复示例',
    'login.title': '登录 Planora',
    'login.subtitle': '选择你的工作方式，然后进入工作区。',
    'login.registerTitle': '创建 Planora 账户',
    'login.registerSubtitle': '选择模式，填写资料，开始你的第一个计划。',
    'login.submit': '登录',
    'login.registerSubmit': '创建账户',
    'login.switchNoAccount': '还没有账户？',
    'login.switchSignup': '立即注册。',
    'login.switchHaveAccount': '已有账户？',
    'login.switchSignin': '立即登录。',
    'login.forgotDemo': '这是界面演示，因此还没有找回密码的邮件。你可以使用任意演示账户，或直接免账号进入。',
    'login.show': '显示',
    'login.hide': '隐藏',
    'login.showAria': '显示密码',
    'login.hideAria': '隐藏密码',
    'login.processing': '正在处理…'
  };

  const DICT = { id: ID, en: EN, zh: ZH };
  const listeners = [];
  const originalText = new WeakMap();
  const originalAttrs = new WeakMap();
  const originalTitle = document.title;
  let mode = savedMode();
  let country = '';
  let lang = 'id';
  let detecting = false;

  function isLang(value) {
    return ['auto', 'id', 'en', 'zh'].includes(value);
  }

  function savedMode() {
    try {
      const value = localStorage.getItem(MODE_KEY);
      return isLang(value) ? value : 'auto';
    } catch {
      return 'auto';
    }
  }

  function guessLang() {
    const candidates = (navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || '']).map((value) => String(value).toLowerCase());
    for (const code of candidates) {
      if (code.startsWith('zh')) return 'zh';
      if (code === 'id' || code.startsWith('id-') || code.startsWith('ms')) return 'id';
    }
    let zone = '';
    try {
      zone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch {
      zone = '';
    }
    if (/^Asia\/(Jakarta|Pontianak|Makassar|Jayapura)/.test(zone)) return 'id';
    if (/^Asia\/(Shanghai|Chongqing|Harbin|Urumqi|Hong_Kong|Macau|Taipei)/.test(zone)) return 'zh';
    if (candidates.some((code) => code.startsWith('en'))) return 'en';
    return 'en';
  }

  function countryLang(code) {
    return COUNTRY_LANG[String(code || '').toUpperCase()] || '';
  }

  function readGeo() {
    try {
      const raw = localStorage.getItem(GEO_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !/^[A-Z]{2}$/.test(data.country || '')) return null;
      if (!data.ts || Date.now() - data.ts > GEO_TTL) return null;
      return data;
    } catch {
      return null;
    }
  }

  function storeGeo(code) {
    try {
      localStorage.setItem(GEO_KEY, JSON.stringify({ country: code, ts: Date.now() }));
    } catch {
      /* storage penuh atau diblokir */
    }
  }

  function locale() {
    return (LANGS[lang] || LANGS.id).locale;
  }

  function t(key, vars) {
    const table = DICT[lang] || ID;
    let text = table[key];
    if (text === undefined) text = ID[key];
    if (text === undefined) return key;
    if (vars) {
      text = text.replace(/\{(\w+)\}/g, (match, name) => (vars[name] === undefined ? match : String(vars[name])));
    }
    return text;
  }

  const PAGE = {
    'Planora — Jadwal Harian & Action Plan': { en: 'Planora — Daily Schedule & Action Plan', zh: 'Planora — 每日日程与行动计划' },
    'Planora menggabungkan jadwal harian, action plan, dan rencana jangka panjang dalam satu ruang kerja. Tersedia mode Personal dan Business.': {
      en: 'Planora brings daily schedules, action plans, and long-term goals into one workspace. Personal and Business modes included.',
      zh: 'Planora 将每日日程、行动计划和长期目标整合到一个工作区中，提供个人和商务两种模式。'
    },
    'Fitur': { en: 'Features', zh: '功能' },
    'Mode': { en: 'Modes', zh: '模式' },
    'Cara Kerja': { en: 'How it works', zh: '使用方法' },
    'Masuk': { en: 'Sign in', zh: '登录' },
    'Coba Gratis': { en: 'Try free', zh: '免费试用' },
    'Jadwal harian · Action plan': { en: 'Daily schedule · Action plan', zh: '每日日程 · 行动计划' },
    'Planora menyatukan jadwal harian, action plan, dan target jangka panjang dalam satu ruang kerja yang tenang — untuk kebutuhan pribadi maupun tim.': {
      en: 'Planora brings your daily schedule, action plans, and long-term goals into one calm workspace — for personal needs and for teams.',
      zh: 'Planora 将每日日程、行动计划和长期目标整合到一个从容的工作区中——既适合个人，也适合团队。'
    },
    'Pratinjau ruang kerja Planora': { en: 'Planora workspace preview', zh: 'Planora 工作区预览' },
    'Progres hari ini 68 persen': { en: 'Today’s progress 68 percent', zh: '今日进度 68%' },
    'Navigasi utama': { en: 'Main navigation', zh: '主导航' },
    'Buka menu': { en: 'Open menu', zh: '打开菜单' },
    'Tutup menu': { en: 'Close menu', zh: '关闭菜单' },
    'Cara kerja': { en: 'How it works', zh: '使用方法' },
    'Mulai Gratis': { en: 'Start free', zh: '免费开始' },
    'Lihat Cara Kerja': { en: 'See how it works', zh: '查看使用方法' },
    'Dua mode kerja': { en: 'Two work modes', zh: '两种工作模式' },
    'Berbasis web, tanpa instalasi': { en: 'Web-based, no installation', zh: '基于网页，无需安装' },
    'Ruang kerja · Personal': { en: 'Workspace · Personal', zh: '工作区 · 个人' },
    'Hari ini': { en: 'Today', zh: '今天' },
    'HARI INI': { en: 'TODAY', zh: '今天' },
    'Hari yang terarah': { en: 'A day with direction', zh: '井然有序的一天' },
    'Olahraga pagi': { en: 'Morning workout', zh: '晨间运动' },
    'Deep work: proposal klien': { en: 'Deep work: client proposal', zh: '深度工作：客户提案' },
    'Review action plan mingguan': { en: 'Weekly action plan review', zh: '每周行动计划回顾' },
    'Kelas bahasa Inggris': { en: 'English class', zh: '英语课' },
    'Rutinitas · 30 menit': { en: 'Routine · 30 min', zh: '日常 · 30 分钟' },
    'Fokus · 2 jam': { en: 'Focus · 2 hours', zh: '专注 · 2 小时' },
    'Rencana · 45 menit': { en: 'Plan · 45 min', zh: '计划 · 45 分钟' },
    'Personal · 60 menit': { en: 'Personal · 60 min', zh: '个人 · 60 分钟' },
    'RENCANA BERIKUTNYA': { en: 'NEXT PLAN', zh: '下一个计划' },
    'Peluncuran portofolio baru': { en: 'New portfolio launch', zh: '新作品集发布' },
    '21 hari lagi': { en: '21 days left', zh: '还剩 21 天' },
    '12 hari beruntun': { en: '12-day streak', zh: '连续 12 天' },
    'Personal & Business': { en: 'Personal & Business', zh: '个人与商务' },
    'Harian sampai tahunan': { en: 'Daily to yearly', zh: '从每日到每年' },
    'Satu alur rencana': { en: 'One planning flow', zh: '一条计划流程' },
    'Berbasis web': { en: 'Web-based', zh: '基于网页' },
    'Buka dari perangkat mana pun': { en: 'Open on any device', zh: '在任何设备上打开' },
    'Semua rencanamu,': { en: 'All your plans,', zh: '你的所有计划，' },
    'di satu tempat yang rapi.': { en: 'in one tidy place.', zh: '都在一个整齐的地方。' },
    'Dari daftar tugas hari ini sampai target tahun depan — semuanya saling terhubung.': {
      en: 'From today’s task list to next year’s goals — everything stays connected.',
      zh: '从今天的任务清单到明年的目标——一切彼此相连。'
    },
    'Timeline harian': { en: 'Daily timeline', zh: '每日时间线' },
    'Susun hari dalam blok waktu yang jelas, dari bangun pagi sampai pekerjaan terakhir selesai.': {
      en: 'Shape your day in clear time blocks, from waking up to the last task of the day.',
      zh: '用清晰的时间块安排一天，从清晨起床到最后一个任务完成。'
    },
    'Action plan': { en: 'Action plan', zh: '行动计划' },
    'Pecah target besar menjadi langkah kecil yang bisa dicentang hari ini juga.': {
      en: 'Break big goals into small steps you can tick off today.',
      zh: '把大目标拆成今天就能勾选的小步骤。'
    },
    'Tab & prioritas': { en: 'Tabs & priorities', zh: '标签与优先级' },
    'Buat papan tugas, checklist, atau catatan sendiri. Tugas prioritas tinggi selalu tampil lebih dulu.': {
      en: 'Create task boards, checklists, or your own notes. High-priority tasks always come first.',
      zh: '创建任务看板、清单或自己的笔记。高优先级任务总是排在前面。'
    },
    'Progres visual': { en: 'Visual progress', zh: '可视化进度' },
    'Lihat progres harian dan rencana dalam satu tampilan, bukan hanya apa yang belum selesai.': {
      en: 'See daily progress and plans in one view, not just what is still unfinished.',
      zh: '在一个界面中查看每日进度和计划，而不只是未完成的事。'
    },
    'Mode bisnis': { en: 'Business mode', zh: '商务模式' },
    'Roadmap, OKR, dan tenggat tim dalam satu papan yang sama dengan pekerjaan harian.': {
      en: 'Roadmap, OKRs, and team deadlines on the same board as your daily work.',
      zh: '路线图、OKR 和团队截止日期，与日常工作在同一块看板上。'
    },
    'Rencana jangka panjang': { en: 'Long-term planning', zh: '长期规划' },
    'Hubungkan tugas hari ini dengan tujuan bulan ini dan visi tahun ini.': {
      en: 'Connect today’s tasks with this month’s goals and this year’s vision.',
      zh: '把今天的任务与本月的目标和今年的愿景连接起来。'
    },
    'Satu aplikasi, dua ritme kerja.': { en: 'One app, two working rhythms.', zh: '一个应用，两种工作节奏。' },
    'Pilih cara kamu bekerja hari ini. Kamu bisa berpindah atau memakai keduanya kapan saja.': {
      en: 'Choose how you work today. You can switch or use both at any time.',
      zh: '选择你今天的工作方式。你随时可以切换或同时使用两者。'
    },
    'Untuk hari-hari yang kamu jalani sendiri — lebih fokus, lebih ringan, lebih terarah.': {
      en: 'For the days you live on your own — more focus, lighter, more intentional.',
      zh: '为属于你自己的日子——更专注、更轻松、更有方向。'
    },
    'Action plan harian & mingguan': { en: 'Daily & weekly action plans', zh: '每日与每周行动计划' },
    'Rutinitas & kebiasaan pribadi': { en: 'Personal routines & habits', zh: '个人日常与习惯' },
    'Target pribadi jangka panjang': { en: 'Long-term personal goals', zh: '长期个人目标' },
    'Catatan progres mingguan': { en: 'Weekly progress notes', zh: '每周进度记录' },
    'Pilih Personal': { en: 'Choose Personal', zh: '选择个人' },
    'Untuk tim dan proyek yang punya tenggat, target kuartal, dan arah jangka panjang.': {
      en: 'For teams and projects with deadlines, quarterly targets, and a long-term direction.',
      zh: '适合有截止日期、季度目标和长期方向的团队与项目。'
    },
    'Roadmap & milestone proyek': { en: 'Project roadmap & milestones', zh: '项目路线图与里程碑' },
    'OKR & target kuartal': { en: 'OKRs & quarterly targets', zh: 'OKR 与季度目标' },
    'Tenggat & prioritas tim': { en: 'Team deadlines & priorities', zh: '团队截止日期与优先级' },
    'Tab projek & catatan keputusan': { en: 'Project tabs & decision notes', zh: '项目标签与决策笔记' },
    'Pilih Business': { en: 'Choose Business', zh: '选择商务' },
    'Tiga langkah,': { en: 'Three steps,', zh: '三个步骤，' },
    'lalu tinggal dijalani.': { en: 'then just live it.', zh: '然后开始执行。' },
    'Pilih mode': { en: 'Choose a mode', zh: '选择模式' },
    'Tentukan apakah kamu bekerja untuk diri sendiri atau untuk tim dan proyek.': {
      en: 'Decide whether you are working for yourself or for a team and its projects.',
      zh: '决定你是为自己工作，还是为团队和项目工作。'
    },
    'Susun rencana': { en: 'Build the plan', zh: '制定计划' },
    'Masukkan jadwal harian dan pecah target besar menjadi action plan yang konkret.': {
      en: 'Add your daily schedule and break big goals into concrete action plans.',
      zh: '安排每日日程，并把大目标拆成具体的行动计划。'
    },
    'Jalankan & pantau': { en: 'Run and track', zh: '执行与追踪' },
    'Centang langkah yang selesai, pantau progres, lalu arsipkan tab yang sudah tuntas ke Riwayat.': {
      en: 'Tick off finished steps, watch your progress, then archive completed tabs to History.',
      zh: '勾选完成的步骤，查看进度，然后把完成的标签归档到历史。'
    },
    'Hari ini adalah titik awal terbaik.': { en: 'Today is the best starting point.', zh: '今天就是最好的起点。' },
    'Buat ruang kerja pertamamu, lalu susun satu action plan kecil untuk hari ini.': {
      en: 'Create your first workspace, then write one small action plan for today.',
      zh: '创建你的第一个工作区，然后为今天写一个小的行动计划。'
    },
    'Mulai Sekarang': { en: 'Start now', zh: '立即开始' },
    'Ruang kerja untuk jadwal harian dan action plan. Dibuat untuk hari-hari yang lebih terarah.': {
      en: 'A workspace for daily schedules and action plans. Built for more intentional days.',
      zh: '用于每日日程和行动计划的工作区。为更有方向的日子而打造。'
    },
    'Produk': { en: 'Product', zh: '产品' },
    'Mode Personal': { en: 'Personal mode', zh: '个人模式' },
    'Mode Business': { en: 'Business mode', zh: '商务模式' },
    'Akun': { en: 'Account', zh: '账户' },
    'Buat Akun': { en: 'Create account', zh: '创建账户' },
    'Untuk Tim': { en: 'For teams', zh: '团队版' },
    'Dibuat untuk hari-hari yang lebih terarah.': { en: 'Built for more intentional days.', zh: '为更有方向的日子而打造。' },
    'Personal': { en: 'Personal', zh: '个人' },
    'Business': { en: 'Business', zh: '商务' },
    'Masuk — Planora': { en: 'Sign in — Planora', zh: '登录 — Planora' },
    'Masuk ke Planora dan pilih mode Personal atau Business untuk mulai mengelola jadwal harian dan action plan.': {
      en: 'Sign in to Planora and choose Personal or Business to start managing your daily schedule and action plans.',
      zh: '登录 Planora，选择个人或商务模式，开始管理每日日程和行动计划。'
    },
    'Kelola jadwal harian, susun action plan, dan jaga arah jangka panjang — tanpa kehilangan ketenangan.': {
      en: 'Manage your daily schedule, shape action plans, and keep your long-term direction — without losing calm.',
      zh: '管理每日日程、制定行动计划，并保持长期方向——同时不失去内心的从容。'
    },
    'SEN': { en: 'MON', zh: '周一' },
    'SEL': { en: 'TUE', zh: '周二' },
    'RAB': { en: 'WED', zh: '周三' },
    'KAM': { en: 'THU', zh: '周四' },
    'JUM': { en: 'FRI', zh: '周五' },
    'Planora — jadwal harian & action plan': { en: 'Planora — daily schedule & action plan', zh: 'Planora — 每日日程与行动计划' },
    '← Kembali ke beranda': { en: '← Back to home', zh: '← 返回首页' },
    'Masuk ke Planora': { en: 'Sign in to Planora', zh: '登录 Planora' },
    'Pilih cara kamu bekerja, lalu masuk ke ruang kerjamu.': {
      en: 'Choose how you work, then step into your workspace.',
      zh: '选择你的工作方式，然后进入工作区。'
    },
    'Kamu akan menggunakan Planora untuk?': { en: 'What will you use Planora for?', zh: '你会用 Planora 做什么？' },
    'Action plan & jadwal harian': { en: 'Action plans & daily schedule', zh: '行动计划与每日日程' },
    'Roadmap & rencana ke depan': { en: 'Roadmap & future plans', zh: '路线图与未来计划' },
    'Nama lengkap': { en: 'Full name', zh: '全名' },
    'Nama kamu': { en: 'Your name', zh: '你的名字' },
    'Email': { en: 'Email', zh: '邮箱' },
    'Kata sandi': { en: 'Password', zh: '密码' },
    'Minimal 8 karakter': { en: 'At least 8 characters', zh: '至少 8 个字符' },
    'Lihat': { en: 'Show', zh: '显示' },
    'Ingat saya': { en: 'Remember me', zh: '记住我' },
    'Lupa kata sandi?': { en: 'Forgot password?', zh: '忘记密码？' },
    'Jelajahi demo tanpa akun': { en: 'Explore the demo without an account', zh: '免账号体验演示' },
    'Demo antarmuka — formulir ini belum memverifikasi akun sungguhan. Data ruang kerja disimpan hanya di peramban ini.': {
      en: 'Interface demo — this form does not verify real accounts. Workspace data is stored in this browser only.',
      zh: '界面演示——此表单不会验证真实账户。工作区数据仅保存在此浏览器中。'
    },
    'Don\'t have an account?': { en: 'Don’t have an account?', zh: '还没有账户？' },
    'Sign up now.': { en: 'Sign up now.', zh: '立即注册。' },
    'Planora — beranda': { en: 'Planora — home', zh: 'Planora — 首页' },
    'Tampilkan kata sandi': { en: 'Show password', zh: '显示密码' }
  };

  const HTML_RULES = [
    ['.hero h1', {
      en: 'Plan your day.<br><span class="hl">Build</span> your future.',
      zh: '规划你的一天。<br><span class="hl">实现</span>你的未来。'
    }],
    ['.auth-brand-quote h2', {
      en: 'A well-planned day makes room for what <em>matters</em>.',
      zh: '规划好的一天，为<em>重要</em>的事留出空间。'
    }]
  ];

  function normalizeText(value) {
    return String(value).replace(/\s+/g, ' ').trim();
  }

  function originalOf(node) {
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    return originalText.get(node);
  }

  function originalAttrOf(element, name) {
    let store = originalAttrs.get(element);
    if (!store) {
      store = {};
      originalAttrs.set(element, store);
    }
    if (!(name in store)) store[name] = element.getAttribute(name) || '';
    return store[name];
  }

  function pageUsesMap() {
    const page = document.body && document.body.dataset ? document.body.dataset.page : '';
    return page === 'landing' || page === 'login';
  }

  function translatePage(root) {
    const scope = root || document.body;
    if (!scope) return;

    scope.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    scope.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    scope.querySelectorAll('[data-i18n-aria]').forEach((element) => {
      element.setAttribute('aria-label', t(element.dataset.i18nAria));
    });

    if (!pageUsesMap()) return;

    HTML_RULES.forEach(([selector, values]) => {
      scope.querySelectorAll(selector).forEach((element) => {
        if (!element.dataset.i18nHtml) element.dataset.i18nHtml = element.innerHTML;
        element.innerHTML = values[lang] || element.dataset.i18nHtml;
      });
    });

    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let node = walker.nextNode();
    while (node) {
      const original = originalOf(node);
      const entry = PAGE[normalizeText(original)];
      if (entry) {
        const value = entry[lang];
        if (value) {
          const lead = original.match(/^\s*/)[0];
          const trail = original.match(/\s*$/)[0];
          node.nodeValue = lead + value + trail;
        } else {
          node.nodeValue = original;
        }
      }
      node = walker.nextNode();
    }

    scope.querySelectorAll('[placeholder], [aria-label], [title]').forEach((element) => {
      ['placeholder', 'aria-label', 'title'].forEach((name) => {
        if (!element.hasAttribute(name)) return;
        const original = originalAttrOf(element, name);
        const entry = PAGE[normalizeText(original)];
        if (entry && entry[lang]) element.setAttribute(name, entry[lang]);
        else if (entry) element.setAttribute(name, original);
      });
    });

    const titleEntry = PAGE[normalizeText(originalTitle)];
    if (titleEntry && titleEntry[lang]) document.title = titleEntry[lang];
  }

  function apply() {
    document.documentElement.lang = lang;
    translatePage();
    listeners.forEach((listener) => {
      try {
        listener(lang, mode);
      } catch (error) {
        console.error(error);
      }
    });
  }

  async function detectCountry() {
    if (detecting || mode !== 'auto') return;
    if (readGeo()) return;
    detecting = true;
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), 3500) : 0;
    try {
      const response = await fetch('https://ipwho.is/?fields=country_code', {
        signal: controller ? controller.signal : undefined,
        cache: 'no-store'
      });
      if (!response.ok) throw new Error('geo');
      const data = await response.json();
      const code = String((data && data.country_code) || '').toUpperCase();
      if (!/^[A-Z]{2}$/.test(code) || data.success === false) throw new Error('geo');
      country = code;
      storeGeo(code);
      if (mode === 'auto') {
        const next = countryLang(code) || guessLang();
        lang = next;
        apply();
      }
    } catch {
      /* offline atau diblokir: tetap pakai tebakan perangkat */
    } finally {
      if (timer) clearTimeout(timer);
      detecting = false;
    }
  }

  function setMode(next) {
    if (!isLang(next)) return;
    mode = next;
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch {
      /* penyimpanan diblokir */
    }
    if (mode === 'auto') {
      const cached = readGeo();
      if (cached) country = cached.country;
      lang = countryLang(country) || guessLang();
    } else {
      lang = mode;
    }
    apply();
    if (mode === 'auto') detectCountry();
  }

  function onChange(listener) {
    if (typeof listener === 'function') listeners.push(listener);
  }

  function languageName() {
    return (LANGS[lang] || LANGS.id).name;
  }

  if (mode === 'auto') {
    const cached = readGeo();
    if (cached) {
      country = cached.country;
      lang = countryLang(country) || guessLang();
    } else {
      lang = guessLang();
    }
  } else {
    lang = mode;
    const cached = readGeo();
    if (cached) country = cached.country;
  }

  window.PlanoraI18n = {
    get lang() { return lang; },
    get mode() { return mode; },
    get country() { return country; },
    t,
    locale,
    setMode,
    onChange,
    languageName,
    translatePage,
    apply
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => apply());
  } else {
    apply();
  }

  if (mode === 'auto') {
    detectCountry();
  }
})();
