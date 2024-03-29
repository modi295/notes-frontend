import React from 'react'

function personCard({ imageSrc = "", name = "", title = "", company = "", quote = "" }) {
    return (
        <div>
            <div class="row d-flex justify-content-center">
    <div class="col-md-10">
        <div class="card shadow">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-lg-4 d-flex justify-content-center align-items-center mb-4 mb-lg-0">
                        <img src={imageSrc} class="rounded-circle img-fluid" alt="woman avatar" width="70" height="70" />
                    </div>
                    <div class="col-lg-8">
                        <p class="fw-bold lead mb-2 p-text"><strong>{name}</strong></p>
                        <p class="fw-bold text-muted mb-0">{title}, {company}</p>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col">
                        <p class="text-muted fw-light">
                            {quote}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

        </div>
    )
}

export default personCard