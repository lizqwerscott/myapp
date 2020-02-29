(in-package :cl-user)
(defpackage myapp.web
  (:use :cl
        :caveman2
        :myapp.config
        :myapp.view
        :myapp.db
        :datafly
        :sxql
        :web-manager)
  (:export :*web*))
(in-package :myapp.web)

;; for @route annotation
(syntax:use-syntax :annot)

;;
;; Application

(defclass <web> (<app>) ())
(defvar *web* (make-instance '<web>))
(clear-routing-rules *web*)

;;
;; Routing rules

;;(defroute "/" (&key (|name| ""))
;;  (render #P"index.html"))

(defroute ("/" :method :GET) ()
          (render #P"index.html"))

(defroute ("/hello/post" :method :POST) (&key |file|)
          (format nil "Hello, ~A" |file|)
          (with-open-file (in "/home/lizqwer/test/temp.html" :direction :output)
            (format in |file|)
            )
          )

(defun standardize-parsed (parsed)
  (mapcar #'(lambda (value)
              (if (listp (cdr value))
                  (cons (car value) (car (cdr value)))
                  (cons (car value) (cdr value)))) parsed))

(defun assoc-string (id lists)
  (cdr (assoc id lists :test #'string=)))

(defparameter *file-storage-directory* #p"/home/pi/test/")

(defroute "/counter" ()
          (maphash #'(lambda (k v)
                       (format t "K:~A, V:~A" k v)) *session*)
          (format nil "You came here ~A times." (incf (gethash :count *session* 0))))

(defroute ("/upload-image" :method :post) (&key _parsed)
          (format t "Image--------:~S" _parsed)
          (format nil "Finish"))

(defroute ("/upload-images" :method :post) (&key |file|)
  (let ((filename (second |file|))
    (data (slot-value (first |file|) 'flexi-streams::vector)))
    (with-open-file (s (merge-pathnames filename *file-storage-directory*) 
               :if-does-not-exist :create 
               :if-exists :supersede  :direction :output
               :element-type  '(unsigned-byte 8))
      (write-sequence data s)))
  (format nil "Finish"))

(defroute ("/add-tasks" :method :post) (&key _parsed)
          (format t "task:~S" (standardize-parsed _parsed)))

(defroute ("/add-task" :method :post) (&key _parsed)
          (let ((parsed (standardize-parsed _parsed))) 
            (add-task (list :id  (assoc-string "id" parsed)
                            :url (assoc-string "url" parsed)
                            :attributes (assoc-string "attributes" parsed)
                            :come-from (assoc-string "come-from" parsed)
                            :description (assoc-string "description" parsed)
                            :download-type (assoc-string "download-type" parsed)
                            :zipp (if (string= "t" (assoc-string "zipp" parsed)) t
                                      (if (string= "nil" (assoc-string "zipp" parsed)) nil))
                            :password (assoc-string "password" parsed))))
          (format nil "Finish")
          )

(defroute ("/sendR" :method :post) (&key _parsed)
          (format t "finish:~S" _parsed))

(defroute ("/uploadQFile" :method :post) (&key _parsed)
          (format t "UploadQFIle---------------------------------:~S" _parsed)
          (format nil "UploadFile:Finish"))

(defroute ("/mergeFiles" :method :post) (&key _parsed)
          (format t "MergeFile------------:~S" _parsed)
          )

(defroute ("/mergeFile" :method :post) (&key _parsed)
          ;(let* ((file (make-pathname :defaults (cdr (car _parsed))))
          (format t "MergeFile----------------------:~S" _parsed)
          )

(defroute ("/mergeFiles" :method :post) (&key _parsed)
          (let* ((file (make-pathname :defaults (cdr (assoc "name" _parsed :test #'string=))))
                 (dirname (merge-pathnames (format nil "~A/" (pathname-name file)) *file-storage-directory*)))
            (with-open-file (out (merge-pathnames file dirname)
                               :if-does-not-exist :create
                               :if-exists :supersede :direction :output
                               :element-type '(unsigned-byte 8))
              (dolist (from (uiop:directory* (merge-pathnames (make-pathname :name :wild :type :wild) dirname)))
                (with-open-file (in from :direction :input :element-type '(unsigned-byte 8))
                  (do ((i (read-byte in nil -1)
                          (read-byte in nil -1)))
                      ((minusp i))
                      (declare (fixnum i))
                      (write-byte i out))))))
          (format nil "Finish"))

(defroute ("/uploadQFiles" :method :post) (&key _parsed)
          (let* ((file (make-pathname :defaults (cdr (assoc "name" (cdr _parsed) :test #'string=))))
                 (dirname (merge-pathnames (format nil "~A/" (pathname-name file)) *file-storage-directory*))
                (data (slot-value (second (car _parsed)) 'flexi-streams::vector)))
            (format t "DirName:~A~%" (namestring dirname))
            (ensure-directories-exist dirname)
            (with-open-file (s (merge-pathnames (format nil "~A~A.~A" (pathname-name file) (cdr (assoc "index" (cdr _parsed) :test #'string=)) (pathname-type file)) dirname)
                               :if-does-not-exist :create
                               :if-exists :supersede :direction :output
                               :element-type '(unsigned-byte 8))
              (write-sequence data s))
            (format nil "Finish")))

;;
;; Error pages

(defmethod on-exception ((app <web>) (code (eql 404)))
  (declare (ignore app))
  (merge-pathnames #P"_errors/404.html"
                   *template-directory*))
