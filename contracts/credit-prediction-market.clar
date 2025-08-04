;; PaySignal Credit Prediction Market
;; Clarity v2 syntax

(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-INVALID-MARKET u101)
(define-constant ERR-MARKET-CLOSED u102)
(define-constant ERR-MARKET-RESOLVED u103)
(define-constant ERR-NO-STAKES u104)
(define-constant ERR-ALREADY-STAKED u105)

(define-data-var admin principal tx-sender)

(define-map markets
  uint
  (tuple
    (borrower principal)
    (deadline uint)
    (resolved bool)
    (outcome (optional bool))
  )
)

(define-map stakes
  (tuple (market-id uint) (predictor principal))
  (tuple (outcome bool) (amount uint))
)

(define-map balances principal uint)

(define-data-var market-counter uint u0)

(define-private (is-admin)
  (is-eq tx-sender (var-get admin))
)

(define-public (create-market (borrower principal) (deadline uint))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (let ((id (+ u1 (var-get market-counter))))
      (map-set markets id
        (tuple
          (borrower borrower)
          (deadline deadline)
          (resolved false)
          (outcome none)
        )
      )
      (var-set market-counter id)
      (ok id)
    )
  )
)

(define-public (stake (market-id uint) (prediction bool) (amount uint))
  (let ((market-opt (map-get? markets market-id)))
    (match market-opt market
      (begin
        (asserts! (not (get resolved market)) (err ERR-MARKET-RESOLVED))
        (asserts! (< block-height (get deadline market)) (err ERR-MARKET-CLOSED))
        (let ((key (tuple (market-id market-id) (predictor tx-sender))))
          (asserts! (is-none (map-get? stakes key)) (err ERR-ALREADY-STAKED))
          (let ((bal (default-to u0 (map-get? balances tx-sender))))
            (asserts! (>= bal amount) (err ERR-NO-STAKES))
            (map-set balances tx-sender (- bal amount))
            (map-set stakes key
              (tuple
                (outcome prediction)
                (amount amount)
              )
            )
            (ok true)
          )
        )
      )
      (err ERR-INVALID-MARKET)
    )
  )
)

(define-public (resolve-market (market-id uint) (outcome bool))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (let ((market-opt (map-get? markets market-id)))
      (match market-opt market
        (begin
          (asserts! (not (get resolved market)) (err ERR-MARKET-RESOLVED))
          (map-set markets market-id
            (tuple
              (borrower (get borrower market))
              (deadline (get deadline market))
              (resolved true)
              (outcome (some outcome))
            )
          )
          (ok true)
        )
        (err ERR-INVALID-MARKET)
      )
    )
  )
)

(define-public (claim-reward (market-id uint))
  (let (
    (market-opt (map-get? markets market-id))
    (stake-key (tuple (market-id market-id) (predictor tx-sender)))
    (stake-opt (map-get? stakes stake-key))
  )
    (match market-opt market
      (match stake-opt stake
        (begin
          (asserts! (get resolved market) (err ERR-MARKET-CLOSED))
          (match (get outcome market) outcome-value
            (if (is-eq outcome-value (get outcome stake))
              (let ((reward (* (get amount stake) u2)))
                (map-set balances tx-sender
                  (+ (default-to u0 (map-get? balances tx-sender)) reward)
                )
                (map-delete stakes stake-key)
                (ok true)
              )
              (begin
                (map-delete stakes stake-key)
                (ok false)
              )
            )
          )
        )
        (err ERR-NO-STAKES)
      )
    )
  )
)

(define-public (deposit (amount uint))
  (begin
    (map-set balances tx-sender
      (+ amount (default-to u0 (map-get? balances tx-sender)))
    )
    (ok amount)
  )
)

(define-read-only (get-market (id uint))
  (ok (map-get? markets id))
)

(define-read-only (get-stake (market-id uint) (who principal))
  (ok (map-get? stakes (tuple (market-id market-id) (predictor who))))
)

(define-read-only (get-balance (account principal))
  (ok (default-to u0 (map-get? balances account)))
)
