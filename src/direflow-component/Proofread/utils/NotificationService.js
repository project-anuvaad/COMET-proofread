import { NotificationManager } from 'react-notifications';

class NotificationService {

    info(msg, title) {
        NotificationManager.info(msg, title);
    }

    error(msg, title) {
        NotificationManager.error(msg, title);
    }

    success(msg, title) {
        NotificationManager.success(msg, title);
    }

    warning(msg, title) {
        NotificationManager.warning(msg, title);
    }

    responseError(err) {
        const reason = err.response && err.response.text ? err.response.text : 'Something went wrong';
        this.error(reason);        
    }
}

export default new NotificationService();