'use client';
import { useState, useRef } from 'react';
import FadeIn from './FadeIn';
import TrackedLink from '@/src/components/TrackedLink';

/* Standard Salary Table: [standard, lower, upper, health(half), pension(half)] */
const SST: [number, number, number, number, number][] = [
  [58000,0,63000,2873.9,8052],[68000,63000,73000,3369.4,8052],
  [78000,73000,83000,3864.9,8052],[88000,83000,93000,4360.4,8052],
  [98000,93000,101000,4855.9,8967],[104000,101000,107000,5153.2,9516],
  [110000,107000,114000,5450.5,10065],[118000,114000,122000,5846.9,10797],
  [126000,122000,130000,6243.3,11529],[134000,130000,138000,6639.7,12261],
  [142000,138000,146000,7036.1,12993],[150000,146000,155000,7432.5,13725],
  [160000,155000,165000,7928,14640],[170000,165000,175000,8423.5,15555],
  [180000,175000,185000,8919,16470],[190000,185000,195000,9414.5,17385],
  [200000,195000,210000,9910,18300],[220000,210000,230000,10901,20130],
  [240000,230000,250000,11892,21960],[260000,250000,270000,12883,23790],
  [280000,270000,290000,13874,25620],[300000,290000,310000,14865,27450],
  [320000,310000,330000,15856,29280],[340000,330000,350000,16847,31110],
  [360000,350000,370000,17838,32940],[380000,370000,395000,18829,34770],
  [410000,395000,425000,20315.5,37515],[440000,425000,455000,21802,40260],
  [470000,455000,485000,23288.5,43005],[500000,485000,515000,24775,45750],
  [530000,515000,545000,26261.5,48495],[560000,545000,575000,27748,51240],
  [590000,575000,605000,29234.5,53985],[620000,605000,635000,30721,56730],
  [650000,635000,665000,32207.5,59475],[680000,665000,695000,33694,59475],
  [710000,695000,730000,35180.5,59475],[750000,730000,770000,37162.5,59475],
  [790000,770000,810000,39144.5,59475],[830000,810000,855000,41126.5,59475],
  [880000,855000,905000,43604,59475],[930000,905000,955000,46081.5,59475],
  [980000,955000,1005000,48559,59475],[1030000,1005000,1055000,51036.5,59475],
  [1090000,1055000,1115000,54009.5,59475],[1150000,1115000,1175000,56982.5,59475],
  [1210000,1175000,1235000,59955.5,59475],[1270000,1235000,1295000,62928.5,59475],
  [1330000,1295000,1355000,65901.5,59475],[1390000,1355000,Infinity,68874.5,59475]
];

function lookupIns(salary: number) {
  for (const r of SST) { if (salary < r[2]) return { health: r[3], pension: r[4] }; }
  const l = SST[SST.length - 1]; return { health: l[3], pension: l[4] };
}

const PENSION_RATE = 0.183;
const HEALTH_RATE = 0.0988; // Tokyo Association rate (combined)
const PENSION_BONUS_CAP = 1500000;
const HEALTH_BONUS_CAP = 5730000;

function formatNum(n: number) { return Math.round(n).toLocaleString('ja-JP'); }
function formatMan(n: number) { return (Math.round(n / 10000)).toLocaleString('ja-JP'); }

interface Results {
  beforeMonthly: number;
  afterMonthly: number;
  beforeBonus: number;
  afterBonus: number;
  beforeCompany: number;
  afterCompany: number;
  beforePersonal: number;
  afterPersonal: number;
  companyReduction: number;
  personalReduction: number;
  totalReduction: number;
  reductionRate: number;
}

export default function SimulatorSection() {
  const [annualIncome, setAnnualIncome] = useState('12000000');
  const [results, setResults] = useState<Results | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const calculate = () => {
    const income = parseInt(annualIncome, 10);

    // Before: all monthly, no bonus
    const beforeMonthly = income / 12;
    const beforeBonus = 0;
    const beforeIns = lookupIns(beforeMonthly);
    // SST health/pension values are per-person (half). Company and personal pay the same.
    const beforeCompany = (beforeIns.health + beforeIns.pension) * 12;
    const beforePersonal = beforeCompany; // same amount

    // After: monthly 100,000, rest as bonus (once per year)
    const afterMonthly = 100000;
    const afterBonus = income - afterMonthly * 12;
    const afterIns = lookupIns(afterMonthly);
    const afterMonthlyCompany = (afterIns.health + afterIns.pension) * 12;
    const afterMonthlyPersonal = afterMonthlyCompany;
    // Bonus: half rate each for company and personal
    const bonusPensionHalf = Math.min(afterBonus, PENSION_BONUS_CAP) * PENSION_RATE / 2;
    const bonusHealthHalf = Math.min(afterBonus, HEALTH_BONUS_CAP) * HEALTH_RATE / 2;
    const afterCompany = afterMonthlyCompany + bonusPensionHalf + bonusHealthHalf;
    const afterPersonal = afterMonthlyPersonal + bonusPensionHalf + bonusHealthHalf;

    const companyReduction = beforeCompany - afterCompany;
    const personalReduction = beforePersonal - afterPersonal;
    const totalReduction = companyReduction + personalReduction;
    const beforeTotal = beforeCompany + beforePersonal;
    const reductionRate = (totalReduction / beforeTotal) * 100;

    setResults({
      beforeMonthly,
      afterMonthly,
      beforeBonus,
      afterBonus,
      beforeCompany,
      afterCompany,
      beforePersonal,
      afterPersonal,
      companyReduction,
      personalReduction,
      totalReduction,
      reductionRate,
    });
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  return (
    <section className="section simulator" id="simulator">
      <div className="inner">
        <FadeIn className="section-center">
          <div className="section-label">SIMULATION</div>
          <h2 className="section-title">社会保険料の削減シミュレーター</h2>
          <p className="section-desc">現在の年収を選択するだけで、削減効果の目安をご確認いただけます。</p>
        </FadeIn>

        <FadeIn>
          <div className="sim-form-card">
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--dark-blue)', marginBottom: '20px' }}>条件を入力してください</div>
            <div className="input-group">
              <label htmlFor="sim-income">現在の年収（役員報酬）</label>
              <select id="sim-income" value={annualIncome} onChange={e => setAnnualIncome(e.target.value)}>
                <option value="6000000">600万円</option>
                <option value="8000000">800万円</option>
                <option value="10000000">1,000万円</option>
                <option value="12000000">1,200万円</option>
                <option value="15000000">1,500万円</option>
                <option value="18000000">1,800万円</option>
                <option value="20000000">2,000万円</option>
                <option value="24000000">2,400万円</option>
                <option value="30000000">3,000万円</option>
              </select>
            </div>
            <button className="calc-btn" onClick={calculate}>シミュレーションする</button>
            <div className="sim-notes">
              ※ 最適化後の月額報酬は10万円、賞与は年1回として算出<br />
              ※ 東京都・協会けんぽの料率で計算（実際の金額は健保組合により異なります）<br />
              ※ 会社負担・本人負担それぞれの削減額を表示しています
            </div>
          </div>
        </FadeIn>

        {results && (
          <div
            ref={resultsRef}
            style={{
              marginTop: '28px',
              opacity: showResults ? 1 : 0,
              transform: showResults ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            <div className="sim-results-card">
              <div className="result-badge">シミュレーション結果</div>
              <div className="result-row">
                <div className="result-item">
                  <div className="r-label">会社負担額</div>
                  <div className="r-value">年間<span className="r-num">{formatMan(results.companyReduction)}</span>万円 削減</div>
                </div>
                <div className="result-divider"></div>
                <div className="result-item">
                  <div className="r-label">本人負担額</div>
                  <div className="r-value">年間<span className="r-num">{formatMan(results.personalReduction)}</span>万円 削減</div>
                </div>
              </div>
              <div className="result-item" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <div className="r-label">合計</div>
                <div className="r-value r-value-lg">年間<span className="r-num">{formatMan(results.totalReduction)}</span>万円 削減</div>
                <div className="r-sub">削減率 約{Math.round(results.reductionRate)}%</div>
              </div>
            </div>

            <div className="sim-breakdown-card">
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--dark-blue)', marginBottom: '16px' }}>報酬構成の変更イメージ</div>
              <table className="breakdown-table">
                <thead>
                  <tr><th></th><th>最適化前</th><th></th><th>最適化後</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>月額報酬</td>
                    <td>{formatMan(results.beforeMonthly)}万円/月</td>
                    <td className="bd-arrow">&rarr;</td>
                    <td>{formatMan(results.afterMonthly)}万円/月</td>
                  </tr>
                  <tr>
                    <td>賞与</td>
                    <td>{formatMan(results.beforeBonus)}万円/年</td>
                    <td className="bd-arrow">&rarr;</td>
                    <td>{formatMan(results.afterBonus)}万円/年</td>
                  </tr>
                  <tr>
                    <td>会社負担（年間）</td>
                    <td>{formatNum(results.beforeCompany)}円</td>
                    <td className="bd-arrow">&rarr;</td>
                    <td>{formatNum(results.afterCompany)}円</td>
                  </tr>
                  <tr>
                    <td>本人負担（年間）</td>
                    <td>{formatNum(results.beforePersonal)}円</td>
                    <td className="bd-arrow">&rarr;</td>
                    <td>{formatNum(results.afterPersonal)}円</td>
                  </tr>
                  <tr className="bd-total">
                    <td>合計（年間）</td>
                    <td>{formatNum(results.beforeCompany + results.beforePersonal)}円</td>
                    <td className="bd-arrow">&rarr;</td>
                    <td>{formatNum(results.afterCompany + results.afterPersonal)}円</td>
                  </tr>
                </tbody>
              </table>
              <div className="bd-diff">年間 <span>-{formatNum(results.totalReduction)}</span>円 の社会保険料削減</div>
            </div>
          </div>
        )}

        <FadeIn className="mid-cta">
          <div className="cta-group">
            <TrackedLink href="/download/" className="btn btn-primary" eventParams={{ form_type: 'download', cta_location: 'simulator' }}>まずは無料で資料請求</TrackedLink>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
