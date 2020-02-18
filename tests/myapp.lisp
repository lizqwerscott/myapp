(in-package :cl-user)
(defpackage myapp-test
  (:use :cl
        :myapp
        :prove))
(in-package :myapp-test)

(plan nil)

;; blah blah blah.

(finalize)
