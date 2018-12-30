new Vue({
    el: '.shop-app',
    data: {
        formLightbox: false,
        formLightbox1: false,
        showFeedback: true
    },
    methods: {
        closeFeedbackLightbox() {
            this.showFeedback = false;
        }
    }
});