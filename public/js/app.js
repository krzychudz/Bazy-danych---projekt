new Vue({
    el: '.shop-app',
    data: {
        formLightbox: false,
        formLightbox1: false,
        formLightbox2: false,
        formLightbox3: true,
        showFeedback: true
    },
    methods: {
        closeFeedbackLightbox() {
            this.showFeedback = false;
        }
    }
});

