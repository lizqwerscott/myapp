(defsystem "myapp-test"
  :defsystem-depends-on ("prove-asdf")
  :author ""
  :license ""
  :depends-on ("myapp"
               "prove")
  :components ((:module "tests"
                :components
                ((:test-file "myapp"))))
  :description "Test system for myapp"
  :perform (test-op (op c) (symbol-call :prove-asdf :run-test-system c)))
