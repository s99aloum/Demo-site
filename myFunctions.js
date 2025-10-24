// ----------------------
// 1. إظهار وإخفاء تفاصيل التطبيقات
document.addEventListener("DOMContentLoaded", function() {
    const detailCheckboxes = document.querySelectorAll(".show-details");
    detailCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function() {
            const targetId = this.dataset.target;
            const detailRow = document.getElementById(targetId);
            detailRow.style.display = this.checked ? "table-row" : "none";
        });
    });
});


// ----------------------
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("appForm");

    if (form) {
        // ----- إرسال النموذج -----
        form.addEventListener("submit", function(e) {
            e.preventDefault();

            const appName = document.getElementById("appName").value.trim();
            const companyName = document.getElementById("companyName").value.trim();
            const appURL = document.getElementById("appURL").value.trim();
            const isFree = document.getElementById("isFree").checked;
            const category = document.getElementById("category").value;
            const appDesc = document.getElementById("appDesc").value.trim();
            const mediaInput = document.getElementById("mediaFiles");
            const files = mediaInput.files;

            const namePattern = /^[A-Za-z]+$/;
            if (!namePattern.test(appName)) { alert("اسم التطبيق يجب أن يكون أحرف إنكليزية فقط وبدون فراغات!"); return; }
            if (!namePattern.test(companyName)) { alert("اسم الشركة يجب أن يكون أحرف إنكليزية فقط!"); return; }
            try { new URL(appURL); } catch { alert("يرجى إدخال رابط موقع صحيح"); return; }
            if (!appDesc) { alert("يرجى إدخال شرح مختصر"); return; }

            const fileData = [];
            if (files.length > 0) {
                let loadedCount = 0;
                for (let i = 0; i < files.length; i++) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        fileData.push({ name: files[i].name, type: files[i].type, data: e.target.result });
                        loadedCount++;
                        if (loadedCount === files.length) saveApp();
                    };
                    reader.readAsDataURL(files[i]);
                }
            } else saveApp();

            function saveApp() {
                const newApp = { name: appName, company: companyName, url: appURL, free: isFree, category, desc: appDesc, media: fileData };
                let newApps = JSON.parse(sessionStorage.getItem("newApps")) || [];
                newApps.push(newApp);
                sessionStorage.setItem("newApps", JSON.stringify(newApps));
                window.location.href = "apps.html";
            }
        });

        // ----- زر إعادة -----
        const resetBtn = form.querySelector('button[type="reset"]');
        resetBtn.addEventListener("click", function() {
            sessionStorage.removeItem("newApps"); // مسح جميع التطبيقات الجديدة
        });
    }

    // ----- عرض التطبيقات الجديدة في apps.html -----
    const appsTable = document.getElementById("appsTable");
    if (appsTable) {
        const newApps = JSON.parse(sessionStorage.getItem("newApps")) || [];
        newApps.forEach((app, index) => {
            const rowId = `details-new-${index}`;
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${app.name}</td>
                <td>${app.company}</td>
                <td>${app.category}</td>
                <td><input type="checkbox" ${app.free ? "checked" : ""} disabled></td>
                <td><input type="checkbox" class="show-details" data-target="${rowId}"></td>
            `;
            appsTable.appendChild(tr);

            const detailTr = document.createElement("tr");
            detailTr.id = rowId;
            detailTr.className = "details-row";
            detailTr.style.display = "none";
            let mediaHTML = "";
            app.media.forEach(file => {
                if (file.type.startsWith("image")) mediaHTML += `<img src="${file.data}" style="max-width:300px;"><br>`;
                else if (file.type.startsWith("video")) mediaHTML += `<video controls width="300"><source src="${file.data}" type="${file.type}"></video><br>`;
                else if (file.type.startsWith("audio")) mediaHTML += `<audio controls><source src="${file.data}" type="${file.type}"></audio><br>`;
            });

            detailTr.innerHTML = `
                <td colspan="5">
                    <strong>عنوان الموقع:</strong> <a href="${app.url}" target="_blank">${app.url}</a><br>
                    <strong>شرح مختصر:</strong> ${app.desc}<br>
                    ${mediaHTML}
                </td>
            `;
            appsTable.appendChild(detailTr);
        });

        // ----- إظهار وإخفاء التفاصيل -----
        const detailCheckboxes = document.querySelectorAll(".show-details");
        detailCheckboxes.forEach(checkbox => {
            checkbox.addEventListener("change", function() {
                const targetId = this.dataset.target;
                const detailRow = document.getElementById(targetId);
                detailRow.style.display = this.checked ? "table-row" : "none";
            });
        });
    }
});
