// 全局变量
let notes = [];
let filteredNotes = [];

// 页面加载时初始化
window.onload = function() {
    loadNotes();
    loadTheme();
    renderNotes();
    
    // 添加备忘录按钮事件监听
    document.getElementById('add-btn').addEventListener('click', addNote);
    
    // 主题切换按钮事件监听
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // 搜索输入事件监听
    document.getElementById('search-input').addEventListener('input', searchNotes);
    
    // 添加键盘事件监听（回车添加备忘录）
    document.getElementById('note-content').addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            addNote();
        }
    });
};

// 从本地存储加载备忘录
function loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        filteredNotes = [...notes];
    } else {
        filteredNotes = [];
    }
}

// 保存备忘录到本地存储
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// 加载主题设置
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').textContent = '☀️';
    }
}

// 切换主题
function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    const themeToggle = document.getElementById('theme-toggle');
    
    if (isDarkMode) {
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

// 添加新备忘录
function addNote() {
    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-content').value.trim();
    
    if (title === '' || content === '') {
        alert('请输入标题和内容');
        return;
    }
    
    const newNote = {
        id: Date.now(),
        title: title,
        content: content,
        date: new Date().toLocaleString('zh-CN')
    };
    
    notes.push(newNote);
    filteredNotes = [...notes];
    saveNotes();
    renderNotes();
    
    // 清空输入框
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    
    // 聚焦到标题输入框
    document.getElementById('note-title').focus();
}

// 搜索备忘录
function searchNotes() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredNotes = [...notes];
    } else {
        filteredNotes = notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) || 
            note.content.toLowerCase().includes(searchTerm)
        );
    }
    
    renderNotes();
}

// 渲染备忘录列表
function renderNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    
    if (filteredNotes.length === 0) {
        notesList.innerHTML = '<p class="no-notes">暂无备忘录</p>';
        return;
    }
    
    filteredNotes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.dataset.id = note.id;
        
        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <div class="note-footer">
                <span class="date">${note.date}</span>
                <div class="actions">
                    <button class="edit-btn" onclick="editNote(${note.id})">编辑</button>
                    <button class="delete-btn" onclick="deleteNote(${note.id})">删除</button>
                </div>
            </div>
        `;
        
        notesList.appendChild(noteElement);
    });
}

// 编辑备忘录
function editNote(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    const noteElement = document.querySelector(`.note[data-id="${id}"]`);
    if (!noteElement) return;
    
    // 创建编辑表单
    noteElement.innerHTML = `
        <div class="edit-form">
            <input type="text" id="edit-title-${id}" value="${note.title}">
            <textarea id="edit-content-${id}">${note.content}</textarea>
            <div class="actions">
                <button class="save-btn" onclick="saveEdit(${id})">保存</button>
                <button class="cancel-btn" onclick="renderNotes()">取消</button>
            </div>
        </div>
    `;
    
    // 聚焦到标题输入框
    document.getElementById(`edit-title-${id}`).focus();
}

// 保存编辑
function saveEdit(id) {
    const title = document.getElementById(`edit-title-${id}`).value.trim();
    const content = document.getElementById(`edit-content-${id}`).value.trim();
    
    if (title === '' || content === '') {
        alert('请输入标题和内容');
        return;
    }
    
    const note = notes.find(n => n.id === id);
    if (note) {
        note.title = title;
        note.content = content;
        note.date = new Date().toLocaleString('zh-CN');
        filteredNotes = [...notes];
        saveNotes();
        
        // 重新执行搜索，保持搜索状态
        searchNotes();
    }
}

// 删除备忘录
function deleteNote(id) {
    if (confirm('确定要删除这个备忘录吗？')) {
        notes = notes.filter(n => n.id !== id);
        filteredNotes = [...notes];
        saveNotes();
        
        // 重新执行搜索，保持搜索状态
        searchNotes();
    }
}

// 添加CSS样式（用于空状态）
const style = document.createElement('style');
style.textContent = `
    .no-notes {
        text-align: center;
        color: #999;
        padding: 40px 0;
        grid-column: 1 / -1;
    }
`;
document.head.appendChild(style);