define(['jsCookie'], function(jsCookie) {

    const cookieKey = 'managerId';

    return {
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
                url: route.url,
                success: (manager) => callback(manager),
            });
        }
    };
});
