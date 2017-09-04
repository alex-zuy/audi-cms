import jsCookie from 'js-cookie';

const cookieKey = 'managerId';

export default {
    isLoggedIn() {
        return !_.isUndefined(this.getManagerId())
    },
    getManagerId() {
        return jsCookie.get(cookieKey);
    },
    getManager(callback) {
        const route = jsRoutes.controllers.Managers.show(this.getManagerId());
        $.ajax({
            method: route.type,
            url: PUBLIC_URL + route.url,
            success: (manager) => callback(manager),
        });
    }
};
