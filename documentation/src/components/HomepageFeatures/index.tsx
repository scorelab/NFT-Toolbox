import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Complete Workflow',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        NFT Toolbox provides all the functionalities required in 
        the process of creating NFTs.
      </>
    ),
  },
  {
    title: 'Multiple Platforms',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        NFT Toolbox does not impose a platform for File Storage. You get to choose
        according to your requirements.
      </>
    ),
  },
  {
    title: 'Sweet and Simple',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        NFT Toolbox has specific functions for specific tasks in the NFT creation
        workflow. No complications.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
