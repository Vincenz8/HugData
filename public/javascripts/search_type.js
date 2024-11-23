document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const sectionTitles = document.querySelectorAll('.section-title-item');

    sectionTitles.forEach(title => {
        title.addEventListener('click', () => {
            const type = title.id;
            searchForm.action = `/search/${type}`;
            sectionTitles.forEach(t => t.classList.remove('active'));
            title.classList.add('active');
            window.location.href = `/search/${type}`;
        });
    });
});