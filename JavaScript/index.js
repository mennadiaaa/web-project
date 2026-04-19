

(function() {
    'use strict';

    const header = document.getElementById('mainHeader');

    function handleScrollShadow() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

 
    if (header) {

        handleScrollShadow();
        
       
        window.addEventListener('scroll', handleScrollShadow);
        
       
        console.log('✅ Eventogo - Sticky navbar active & JavaScript loaded successfully');
    } else {
        console.warn('⚠️ Header element not found - sticky shadow effect disabled');
    }

   
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        
        if (dropbtn && dropdownContent) {
           
            dropbtn.addEventListener('click', function(e) {
               
                if ('ontouchstart' in window) {
                    e.preventDefault();
                    const isOpen = dropdownContent.style.display === 'block';
              
                    document.querySelectorAll('.dropdown-content').forEach(content => {
                        content.style.display = 'none';
                    });
                   
                    dropdownContent.style.display = isOpen ? 'none' : 'block';
                }
            });
        }
    });
    

    document.addEventListener('click', function(e) {
        if ('ontouchstart' in window) {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown-content').forEach(content => {
                    content.style.display = 'none';
                });
            }
        }
    });
})();