# Yandex Music Fisher (1.10.0)

Расширение браузера для скачивания музыки с сервисов [Яндекс.Музыка](https://music.yandex.ru/)
и [Яндекс.Радио](https://radio.yandex.ru/).

Скачивает треки, плейлисты, альбомы (с обложкой) и дискографии. Устанавливает ID3 тег.
Прерванные загрузки можно возобновлять.

[Список изменений](https://github.com/egoroof/yandex-music-fisher/releases)

### Что нужно

Нужен браузер на движке Chromium: [Chrome](https://www.google.com/chrome) (рекомендуется),
[Яндекс.Браузер](https://browser.yandex.ru), [Opera](https://www.opera.com) или подобный.

### Установка

[Скачайте архив по этой ссылке](https://github.com/egoroof/yandex-music-fisher/releases/download/v1.10.0/yandex-music-fisher_1.10.0.zip),
извлеките в текущую папку, откройте страницу расширений в браузере и перенесите туда мышкой извлечённую папку __yandex-music-fisher__.
Затем в браузере появится новое расширение:

![Установка](/readme_img/install.gif "Установка")

Обновляется расширение так же. Когда появится обновление, расширение оповестит вас.

### Как пользоваться

Откройте страницу на [Яндекс.Музыка](https://music.yandex.ru/) с нужным ![blue](/readme_img/blue.png) треком,
![yellow](/readme_img/yellow.png) альбомом или ![green](/readme_img/green.png) плейлистом - иконка изменит цвет в зависимости
от открытой страницы. Нажав на неё откроется всплывающее окно с информацией о загрузке и кнопкой для начала скачивания.

![Использование](/readme_img/usage.gif "Использование")

После нажатия на кнопку скачивания начнётся загрузка. Прогресс виден на вкладке "Загрузки":

![Загрузки](/readme_img/loader.png)

На странице исполнителя отметьте нужные альбомы и качайте дискографию:

![Дискография](/readme_img/discography.png)

На [Яндекс.Радио](https://radio.yandex.ru/) выберите жанр для прослушивания и качайте играющие треки.

### Пути сохранения

- Загрузки сохраняются в папку, которая указана в настройке браузера "__Расположение загружаемых файлов__".
- Для __дискографии__ создаётся отдельная папка с именем исполнителя, в которую сохраняются альбомы.
- Для __альбома__ / __плейлиста__ создаётся отдельная папка с именем исполнителя и названием альбома / плейлиста.
- Если __альбом__ состоит из нескольких дисков, то создаются соответствующие папки.

### Ограничения

Поскольку сервис Яндекс.Музыка позволяет слушать музыку только пользователям из России, Украины, Беларуси и
Казахстана, то и скачивать музыку с помощью этого расширения можно только из этих стран.

Если расширение показывает ошибку, возможно скачивание блокируется Яндексом.
Перейдите на главную страницу Яндекс.Музыки - если увидите капчу, введите текст с картинки.
Затем возобновляйте скачивание через расширение.

### Условия использования

Используя Расширение Yandex Music Fisher, вы считаетесь принявшим
[Условия использования сервиса Яндекс.Музыка](https://yandex.ru/legal/music_termsofuse/) и
[Условия использования сервиса Яндекс.Радио](https://yandex.ru/legal/radio_termsofuse/).
Если не согласны с Условиями, вы не вправе использовать сервис Яндекс.Музыка / Яндекс.Радио.
Разработчики Расширения не несут ответственность за нарушения Условий, поэтому используйте Расширение на свой страх и риск.

### Зеркала

- [GitHub](https://github.com/egoroof/yandex-music-fisher)
- [Bitbucket](https://bitbucket.org/egoroof/yandex-music-fisher)

### Сборка расширения (для разработчиков)

1. Устанавливаем [Node.js](https://nodejs.org/en/) 6+.
2. Обновляем зависимости и собираем расширение: `npm run build`

Загружать браузером распакованное расширение после сборки из папки `src`.

После каждого нового билда нужно обновлять расширение на странице с расширениями браузера,
чтобы перезагрузить фоновую страницу и подхватить её изменения.

Остальные скрипты смотрите в файле `package.json` в секции `scripts`.
