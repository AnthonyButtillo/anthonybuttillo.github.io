async function testBTN() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const query = new URLSearchParams({
        accessApiLevel: '0',
        include: 'attachments',
        exclude: 'filteredOutRows',
        columnIds: 'string',
        filterId: 'string',
        ifVersionAfter: '0',
        level: '0',
        pageSize: '100',
        page: '1',
        paperSize: 'LETTER',
        rowIds: 'string',
        rowNumbers: 'string',
        rowsModifiedSince: '2020-01-30T13:25:32-07:00'
    }).toString();

    const sheetId = '3455901731082116';
    const resp = await fetch(
        `https://api.smartsheet.com/2.0/sheets/${sheetId}?${query}`,
        {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + token,
                'smartsheet-integration-source': 'AI,SampleOrg,My-AI-Connector-v2',
                Accept: 'string'
            }
        }
    );

    const data = await resp.text();
    console.log(data);
}
