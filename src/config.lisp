(in-package :cl-user)
(defpackage myapp.config
  (:use :cl)
  (:import-from :envy
                :config-env-var
                :defconfig)
  (:export :config
           :*application-root*
           :*static-directory*
           :*template-directory*
           :appenv
           :developmentp
           :productionp))
(in-package :myapp.config)

(setf (config-env-var) "APP_ENV")

(defparameter *application-root*   (asdf:system-source-directory :myapp))
(defparameter *static-directory*   (merge-pathnames #P"static/" *application-root*))
(defparameter *template-directory* (merge-pathnames #P"templates/" *application-root*))

(defconfig :common
  `(:application-root ,(asdf:component-pathname (asdf:find-system :myapp))
    :databases ((:maindb :sqlite3 :database-name ,(merge-pathnames #P"db/test.db" *application-root*)))))

(defconfig |development|
  `(:debug T
    :databases ((:maindb :sqlite3 :database-name ,(merge-pathnames #P"./db/test.db" *application-root*)))))

(defconfig |production|
  '())

(defconfig |test|
  '())

(defun config (&optional key)
  (envy:config #.(package-name *package*) key))

(defun appenv ()
  (uiop:getenv (config-env-var #.(package-name *package*))))

(defun developmentp ()
  (string= (appenv) "development"))

(defun productionp ()
  (string= (appenv) "production"))
