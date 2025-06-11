type AlignmentResult = {
    alignedSeq1: string;
    alignedSeq2: string;
    score: number;
};

export function needlemanWunsch(
    seq1: string,
    seq2: string,
    matchScore = 1,
    mismatchScore = -1,
    gapPenalty = -2
): AlignmentResult {
    const m = seq1.length;
    const n = seq2.length;

    const F: number[][] = Array.from({ length: m + 1 }, () =>
        new Array(n + 1).fill(0)
    );

    for (let i = 0; i <= m; i++) {
        F[i][0] = gapPenalty * i;
    }
    for (let j = 0; j <= n; j++) {
        F[0][j] = gapPenalty * j;
    }

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const matchOrMismatch =
                seq1[i - 1] === seq2[j - 1] ? matchScore : mismatchScore;

            const scoreDiagonal = F[i - 1][j - 1] + matchOrMismatch;
            const scoreUp = F[i - 1][j] + gapPenalty;
            const scoreLeft = F[i][j - 1] + gapPenalty;

            F[i][j] = Math.max(scoreDiagonal, scoreUp, scoreLeft);
        }
    }

    let alignedSeq1 = "";
    let alignedSeq2 = "";
    let i = m;
    let j = n;

    while (i > 0 && j > 0) {
        const currentScore = F[i][j];
        const matchOrMismatch =
            seq1[i - 1] === seq2[j - 1] ? matchScore : mismatchScore;

        if (currentScore === F[i - 1][j - 1] + matchOrMismatch) {
            alignedSeq1 = seq1[i - 1] + alignedSeq1;
            alignedSeq2 = seq2[j - 1] + alignedSeq2;
            i--;
            j--;
        } else if (currentScore === F[i - 1][j] + gapPenalty) {
            alignedSeq1 = seq1[i - 1] + alignedSeq1;
            alignedSeq2 = "-" + alignedSeq2;
            i--;
        } else {
            alignedSeq1 = "-" + alignedSeq1;
            alignedSeq2 = seq2[j - 1] + alignedSeq2;
            j--;
        }
    }

    while (i > 0) {
        alignedSeq1 = seq1[i - 1] + alignedSeq1;
        alignedSeq2 = "-" + alignedSeq2;
        i--;
    }
    while (j > 0) {
        alignedSeq1 = "-" + alignedSeq1;
        alignedSeq2 = seq2[j - 1] + alignedSeq2;
        j--;
    }

    return {
        alignedSeq1,
        alignedSeq2,
        score: F[m][n],
    };
}
