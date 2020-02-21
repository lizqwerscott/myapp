(in-package :cl-user)
(defpackage myapp.web
  (:use :cl
        :caveman2
        :myapp.config
        :myapp.view
        :myapp.db
        :datafly
        :sxql)
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

(defparameter *file-storage-directory* #p"/home/pi/test/")

(defroute "/counter" ()
          (maphash #'(lambda (k v)
                       (format t "K:~A, V:~A" k v)) *session*)
          (format nil "You came here ~A times."(incf (gethash :counter *session* 0))))

(defroute ("/upload-image" :method :post) (&key |file|)
  (let ((filename (second |file|))
    (data (slot-value (first |file|) 'flexi-streams::vector)))
    (with-open-file (s (merge-pathnames filename *file-storage-directory*) 
               :if-does-not-exist :create 
               :if-exists :supersede  :direction :output
               :element-type  '(unsigned-byte 8))
      (write-sequence data s)))
  (format nil "Finish"))

(defroute ("/sendR" :method :post) (&key _parsed)
          (format t "finish:~S" _parsed))

(defroute ("/uploadQFile" :method :post) (&key _parsed)
          (format t "UploadQFIle---------------------------------:~S" _parsed)
          (format nil "UploadFile:Finish"))

(defroute ("/mergeFile" :method :post) (&key _parsed)
          (format t "MergeFile----------------------:~S" _parsed)
          )

(defroute ("/mergeFiles" :method :post) (&key _parsed)
          (let* ((file (make-pathname :defaults (cdr (assoc "name" _parsed :test #'string=))))
                 (dirname (merge-pathnames (format nil "~A/" (pathname-name file)) *file-storage-directory*)))
            (with-open-file (s (merge-pathnames file dirname)
                               :if-does-not-exist :create
                               :if-exists :supersede :direction :output
                               :element-type '(unsigned-byte 8))
              (dolist (i (directory* (merge-pathnames (make-pathname :name :wild :type :wild) dirname)))
                (let ((data (make-array 10 :fill-pointer 0 :adjustable t :element-type 'bit))) 
                  (with-open-file (out i :element-type '(unsigned-byte 8))
                    (read-sequence data out))
                  (write-sequence data s)))))
          (format nil "Finish")
          )

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
