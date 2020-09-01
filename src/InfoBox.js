import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'

function InfoBox({title, cases,total,isRed, active, ...props}) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}  `}>
            <CardContent>
                {/* Title i.e. Coronaviruses cases */}
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>

                {/* Number of cases */}

                {/* Start Here!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>

                {/* Total */}
                <Typography className="infoBox__total" color="textSecondary">
                    {total} total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
