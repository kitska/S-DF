import { format } from 'date-fns-tz';
import { ru } from 'date-fns/locale';

export const formatDate = dateString => {
	const date = new Date(dateString);
	return format(date, 'dd.MM.yyyy HH:mm', {
		locale: ru,
		timeZone: 'Europe/Kyiv',
	});
};
