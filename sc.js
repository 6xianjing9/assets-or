  <script>
    /* ========= UTILITAS ========= */
    // Fungsi untuk mendapatkan waktu relatif (misal "1 menit yang lalu")
    function getRelativeTime(timeStamp) {
      const now = new Date();
      const diffMs = now - timeStamp;
      const diffMins = Math.floor(diffMs / 60000);
      return diffMins <= 0 ? "baru saja" : diffMins + " menit yang lalu";
    }

    // Tampilkan initial loader saat DOM siap, hilangkan setelah 2 detik
    document.addEventListener("DOMContentLoaded", function() {
      setTimeout(() => {
        document.getElementById('loaderOverlay').style.display = 'none';
      }, 2000);
    });

    // Fungsi transisi antar halaman dengan loader overlay
    function showPage(pageId) {
      const loader = document.getElementById('loaderOverlay');
      loader.style.display = 'flex';
      setTimeout(() => {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        loader.style.display = 'none';
      }, 1000);
    }

    /* ========= PAGE 1: FORM UPLOAD ========= */
    const usernameInput = document.getElementById('username');
    const imageUpload = document.getElementById('imageUpload');
    const btnNext1 = document.getElementById('btnNext1');
    const imagePreview = document.getElementById('imagePreview');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    let uploadedImageURL = '';
    let fileName = '';

    function checkFormValidity() {
      if (usernameInput.value.trim() !== '' && imageUpload.files.length > 0) {
        btnNext1.classList.remove('btn-secondary');
        btnNext1.classList.add('btn-primary');
      } else {
        btnNext1.classList.remove('btn-primary');
        btnNext1.classList.add('btn-secondary');
      }
    }
    usernameInput.addEventListener('input', checkFormValidity);
    imageUpload.addEventListener('change', function() {
      checkFormValidity();
      if (this.files && this.files[0]) {
        // Validasi tipe file: hanya JPG/JPEG, PNG, GIF
        const fileType = this.files[0].type;
        if (!fileType.match(/^image\/(jpeg|png|gif)$/)) {
          alert("Error: Hanya file gambar (JPG, JPEG, PNG, GIF) yang diizinkan!");
          this.value = "";
          imagePreview.innerHTML = "";
          return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
          uploadedImageURL = e.target.result;
          fileName = imageUpload.files[0].name;
          imagePreview.innerHTML = '<img src="' + uploadedImageURL + '" alt="Preview">';
        }
        reader.readAsDataURL(this.files[0]);
      }
    });
    btnNext1.addEventListener('click', function() {
      if (usernameInput.value.trim() === '' || imageUpload.files.length === 0) {
        alert('Anda belum mengisi dengan benar atau gambar tidak sesuai');
        return;
      }
      progressContainer.style.display = 'block';
      let progress = 0;
      const progressSteps = [
        { percent: 32, text: '32% upload' },
        { percent: 46, text: '46% memeriksa user' },
        { percent: 54, text: '54% memeriksa gambar' },
        { percent: 89, text: '89% verifikasi data' },
        { percent: 98, text: '98% mengirim' },
        { percent: 100, text: '100% selesai' }
      ];
      let stepIndex = 0;
      const interval = setInterval(() => {
        if (stepIndex < progressSteps.length) {
          progress = progressSteps[stepIndex].percent;
          progressBar.style.width = progress + '%';
          progressBar.setAttribute('aria-valuenow', progress);
          progressBar.innerText = progress + '%';
          progressText.innerText = progressSteps[stepIndex].text;
          stepIndex++;
        } else {
          clearInterval(interval);
          // Siapkan data untuk Page 2
          document.getElementById('displayUsername').innerText = 'Username: ' + usernameInput.value;
          document.getElementById('uploadedFileTitle').innerText = fileName;
          document.getElementById('uploadedDescription').innerText = 'Deskripsi: Deskripsi file yang diupload';
          showPage('page2');
          startActivityAuto();
          startChatAuto();
        }
      }, 800);
    });

    /* ========= PAGE 2: DUMMY ACTIVITY WIDGET ========= */
    // Daftar nama acak
    const randomNames = [
      "Andi", "Budi", "Citra", "Dewi", "Eka", "Fajar", "Gilang", "Hana", "Ika", "Joko", "Kiki", "Lia", "Mira", "Nina", "Oki"
    ];
    // Daftar kegiatan acak
    const activityActions = [
      "mengupload foto", "memberikan komentar", "menyukai postingan", "mengomentari video",
      "membagikan artikel", "memperbarui status", "berbagi artikel", "memperbarui profil",
      "mengikuti event", "mengunduh file", "mengomentari foto", "membagikan link", "mengirim pesan"
    ];
    const activityContainer = document.getElementById('activityContainer');
    function updateActivity() {
      // Pilih nama dan kegiatan secara acak
      const name = randomNames[Math.floor(Math.random() * randomNames.length)];
      const action = activityActions[Math.floor(Math.random() * activityActions.length)];
      // Tambahkan timestamp pada aktivitas (menggunakan waktu saat ini)
      const timeStamp = getRelativeTime(new Date());
      const actDiv = document.createElement('div');
      actDiv.classList.add('activity');
      actDiv.innerHTML = '<strong>' + name + '</strong> ' + action + ' - ' + timeStamp;
      // Tampilkan hanya 1 aktivitas dengan efek fade in/out
      activityContainer.innerHTML = "";
      activityContainer.appendChild(actDiv);
      setTimeout(() => { actDiv.classList.add('show'); }, 50);
      setTimeout(() => { actDiv.classList.remove('show'); }, 3000);
    }
    function startActivityAuto() {
      updateActivity();
      setInterval(updateActivity, 4000);
    }

    /* ========= PAGE 2: CHATBOX ========= */
    const chatBox = document.getElementById('chatBox');
    const chatInput = document.getElementById('chatInput');
    const sendChat = document.getElementById('sendChat');
    // Dummy komentar 15 data
    const dummyComments = [
      "Komentar dummy 1", "Komentar dummy 2", "Komentar dummy 3", "Komentar dummy 4",
      "Komentar dummy 5", "Komentar dummy 6", "Komentar dummy 7", "Komentar dummy 8",
      "Komentar dummy 9", "Komentar dummy 10", "Komentar dummy 11", "Komentar dummy 12",
      "Komentar dummy 13", "Komentar dummy 14", "Komentar dummy 15"
    ];
    let dummyChatIndex = 0;
    function addChatMessage(message, isUser = true, timeStamp = new Date(), name = '', avatarUrl = '') {
      const div = document.createElement('div');
      div.classList.add('mb-2', 'd-flex', 'align-items-start', 'highlight');
      let avatarHTML = "";
      if (isUser) {
        avatarHTML = '<img src="https://ui-avatars.com/api/?name=' + encodeURIComponent(usernameInput.value || "Anda") + '&size=40" class="rounded-circle me-2" style="width:40px; height:40px;">';
      } else {
        avatarHTML = '<img src="https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&size=40" class="rounded-circle me-2" style="width:40px; height:40px;">';
      }
      const nameDisplay = isUser ? (usernameInput.value || "Anda") : name;
      // Tanda waktu tidak ditampilkan untuk chatbox
      const messageHTML = '<div class="' + (isUser ? 'user-comment' : 'chat-message') + ' flex-grow-1"><strong>' + nameDisplay + ':</strong> ' + message + '</div>';
      div.innerHTML = avatarHTML + messageHTML;
      // Tempatkan pesan terbaru di atas
      chatBox.prepend(div);
      chatBox.scrollTop = 0;
    }
    sendChat.addEventListener('click', function() {
      const msg = chatInput.value.trim();
      if (msg !== '') {
        addChatMessage(msg, true, new Date(), usernameInput.value, "https://ui-avatars.com/api/?name=" + encodeURIComponent(usernameInput.value || "Anda") + "&size=40");
        chatInput.value = '';
      }
    });
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendChat.click();
      }
    });
    function startChatAuto() {
      function addNextDummyChat() {
        if (dummyChatIndex >= dummyComments.length) {
          dummyChatIndex = 0;
        }
        const name = randomNames[dummyChatIndex % randomNames.length];
        addChatMessage(dummyComments[dummyChatIndex], false, new Date(new Date() - 60000), name, "https://ui-avatars.com/api/?name=" + encodeURIComponent(name) + "&size=40");
        dummyChatIndex++;
        // Delay random antara 5000 - 10000 ms (5-10 detik)
        setTimeout(addNextDummyChat, Math.floor(Math.random() * 5000) + 5000);
      }
      addNextDummyChat();
    }
    document.getElementById('btnNext2').addEventListener('click', function() {
      showPage('page3');
    });

    /* ========= PAGE 3: VERIFIKASI BUKAN ROBOT ========= */
    const robotCheck = document.getElementById('robotCheck');
    const robotAnimation = document.getElementById('robotAnimation');
    robotCheck.addEventListener('change', function() {
      if (this.checked) {
        robotAnimation.innerHTML = '<div class="spinner-rotate"></div>';
        setTimeout(() => {
          robotAnimation.innerHTML = '<div class="checkmark"><i class="bi bi-check-circle-fill"></i></div>';
          setTimeout(() => {
            const loader = document.getElementById('loaderOverlay');
            loader.style.display = 'flex';
            setTimeout(() => {
              window.location.href = 'https://google.com';
            }, 1000);
          }, 1000);
        }, 2000);
      }
    });
  </script>
