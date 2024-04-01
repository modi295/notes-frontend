import React from 'react'

function personCard({ imageSrc = "", name = "", title = "", company = "", quote = "" }) {
    return (
        <div>
            <div className="row d-flex justify-content-center">
    <div className="col-md-10">
        <div className="card shadow">
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-lg-4 d-flex justify-content-center align-items-center mb-4 mb-lg-0">
                        <img src={imageSrc} className="rounded-circle img-fluid" alt="woman avatar" width="70" height="70" />
                    </div>
                    <div className="col-lg-8">
                        <p className="fw-bold lead mb-2 p-text"><strong>{name}</strong></p>
                        <p className="fw-bold text-muted mb-0">{title}, {company}</p>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col">
                        <p className="text-muted fw-light">
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