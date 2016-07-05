
(function(){
    window.addEventListener('HTMLImportsLoaded', function() {
        imports();
        addFooter();
    });

    function imports(){
        /* attach footer import to main document footer instance */
        var footerDoc = document.querySelector('#footer-doc')
            .import
            .querySelectorAll('footer>*');
        var footerInstance=document.querySelector('[data-role=footer]');
        for (var i = 0; i < footerDoc.length; i++) {
            footerInstance.appendChild(footerDoc[i]);
        }
    }

    function addFooter(){
        $(function(){
            var $footer=$('footer[data-role="footer"]');
            $(window).on('ui.drawer.panel.show',function(event,data){
                $footer.addClass('darken');
            });
            $(window).on('ui.drawer.panel.hide',function(event,data){
                $footer.removeClass('darken');
            });
        });
    }
})();
