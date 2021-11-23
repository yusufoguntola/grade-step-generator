const processingText = document.getElementById('processing-text');
processingText.style.display = "none";
function processData() {
    const fileInput = document.getElementById('basic-salary-file');
    const empFile = document.getElementById('employees-file');
    if(fileInput.files.length <=0 || empFile.files.length <= 0){
        alert('Select files to proceed');
    }else{
        processingText.style.display = "block";
        document.getElementById('btn-generate').style.display = "none";
        Papa.parse(fileInput.files[0], {
            header: true,
            worker: true,
            dynamicTyping: true,
            complete: function(result) {
                generateGrade(result.data);
            }
        });
    }
}

function generateGrade(salaryData) {
    const output = [];
    const fileInput = document.getElementById('employees-file');
    Papa.parse(fileInput.files[0], {
        header: true,
        dynamicTyping: true,
        complete: function(result) {
            result.data.forEach(item => {
                let nextGrade = parseInt(item.GRADE) + 1;
                nextGrade = nextGrade === 11 ? 12 : nextGrade;
                output.push({
                    ID: item.ID,
                    BASIC: item.BASIC,
                    GRADE: nextGrade,
                    STEP: getNextStep(salaryData, nextGrade, parseFloat(item.BASIC))
                })
            });
            const csv = Papa.unparse(output);
            const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"})
            var encodedUri = window.URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "generated_grade_steps.csv");
            link.innerHTML = "Click to download";
            document.getElementById('download-wrapper').appendChild(link);
            processingText.style.display = "none";
        }
    });
}

function getNextStep(salaryData, nextGrade, basic){
    const filtered = salaryData.filter(item => (parseInt(item.GRADE) === nextGrade) && (parseFloat(item.BASIC) > basic));
    const basics = filtered.sort((x, y) => parseInt(x.STEP) - parseInt(y.STEP));
    if(basics.length > 0){
        return basics[0].STEP;
    }
    return 0;
}