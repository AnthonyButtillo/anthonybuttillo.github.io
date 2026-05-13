async function getRowsSmall(sheetId, token) {
    const query = new URLSearchParams({
        pageSize: '5',
        page: '1'
    }).toString();

    const request = new Request(`https://corsproxy.io/?url=https://api.smartsheet.com/2.0/sheets/${sheetId}?${query}`,
        {
            method: 'GET',
            headers: {Authorization: 'Bearer ' + token, Accept: 'string'}
        }
    );

    const resp = await call(request, 0);
    if (resp === null) return null;

    return JSON.parse(resp);
}

async function postRows(output, sheetId, token) {
    const query = new URLSearchParams({
        accessApiLevel: '0',
        allowPartialSuccess: 'false',
        overrideValidation: 'false'
    }).toString();

    const request = new Request(
        `https://corsproxy.io/?url=https://api.smartsheet.com/2.0/sheets/${sheetId}/rows?${query}`,
        {
            method: 'POST',
            headers: {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'},
            body: JSON.stringify([
                {
                    "toTop": true,
                    "cells": output
                }
            ])
        }
    );

    const resp = await call(request, 0);
    if (resp === null) return null;

    return JSON.parse(resp);
}

async function call(request, count) {
    const resp = await fetch(request.clone());
    console.log(resp);
    if (resp.ok) return await resp.text();

    const errorCode = resp.errorCode;

    if (count > 5) return null;

    if (errorCode === 4000 || errorCode === 4001 || errorCode === 4002 || errorCode === 4003 || errorCode === 4004 || errorCode === 4005) {
        return call(request, count + 1);
    }
}