import ReactDOM from 'react-dom';
import React, { useEffect, useRef } from 'react';
import * as THREE from "three";
import classNames from 'classnames';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './index.css';
import { Suspense, useMemo, useState } from 'react';
import GameOfLife from './lib/gol';
import { generateEmptyState, generatePreloadedState, generateRandomState, isEmptyState } from './utils'
import Earth from './Earth';
import Modal from 'react-modal';
import patterns from './patterns.json';
import Title from './Title';
import SkyBox from './SkyBox';
import BasicScene from './BasicScene';
import FootbalScene from './FootbalScene';

const tempBoxes = new THREE.Object3D();

Modal.setAppElement('#root');

const customStyles = {
  content: {
    maxWidth: '30rem',
    margin: '0 auto',
    height: 'auto'
  },
};

const Boxes = ({ i, j, gameState }) => {
  const material = new THREE.MeshLambertMaterial({ color: "red" });
  const boxesGeometry = new THREE.BoxBufferGeometry(0.95, 0.95, 0.95);
  const ref = useRef();
  function getPosition(x, y) {
    return [
      0.5 + x - i / 2,
      0.5,
      0.5 + y - j / 2,
    ]
  }

  useFrame(() => {
    let counter = 0;
    for (let y = 0; y < i; y++) {
      for (let x = 0; x < j; x++) {
        const id = counter++;
        const [x3D, y3D, z3D] = getPosition(x, y);
        if (gameState[y][x] === 1) {
          tempBoxes.position.set(x3D, y3D, z3D);
        }
        tempBoxes.updateMatrix();
        ref.current.setMatrixAt(id, tempBoxes.matrix);
      }
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh visible={!isEmptyState(gameState)} ref={ref} args={[boxesGeometry, material, i * j]} />;
};


const ThreeContent = ({ gameState, gridSize, toggleCell, showGrid }) => {
  const handlePlaneClick = (e) => {
    const { point } = e.intersections[0];

    let range = gridSize / 2;
    let x, y;
    if (point) {
      if (point.x < 0) x = Math.ceil(range + point.x) - 1;
      else x = Math.floor(range + point.x);

      if (point.z < 0) y = +Math.ceil(range + point.z) - 1;
      else y = Math.floor(range + point.z)
      toggleCell(x, y);
    }

  }

  return (
    <>
      <spotLight position={[0, 20, gridSize]} intensity={2} color="#ffffff" castShadow="true" />
      { showGrid && <gridHelper scale={1} args={[gridSize, gridSize, "#ffffff", "#ffffff"]} />}
      <Suspense>
        <Earth gridSize={gridSize} onClick={handlePlaneClick} />
      </Suspense>
      {<Boxes i={gridSize} j={gridSize} gameState={gameState} />}
      {<OrbitControls enableZoom={true} />}
    </>
  )
}

let interval;

function App() {
  const [gridSize, setGridSize] = useState(50);

  const [patternModalOpen, setPatternModalOpen] = useState(false);

  const [theme, setTheme] = useState('Space');

  const [themeModalOpen, setThemeModalOpen] = useState(false);

  const [rulesModalOpen, setRulesModalOpen] = useState(false);

  const [showGrid, setShowGrid] = useState(true);

  const [generation, setGeneration] = useState(0);

  const [sound, setSound] = useState(false);

  const [speed, setSpeed] = useState(5);

  const [gameStarted, setGameStarted] = useState(false);

  const [gameState, setGameState] = useState(generatePreloadedState(gridSize, patterns.spiral));

  const gameOfLife = useMemo(() => new GameOfLife(gameState), [gameState]);

  useEffect(() => {
    setGameState(generatePreloadedState(gridSize, gameState))
  }, [gridSize])

  function toggleCell(x, y) {
    const newGameState = [...gameState];

    const row = [...newGameState[y]];

    if (row) {
      row[x] = row[x] ? 0 : 1;
    }

    newGameState[y] = row;

    setGameState(newGameState);
    setGeneration(0);

  }

  function handleGridSizeChange(e) {
    setGridSize(+e.target.value);
  }

  function handleSpeedChange(e) {
    setSpeed(+e.target.value);
  }

  function start() {
    setGameStarted(true);
    interval = setInterval(() => {
      evolve();
    }, 500 / speed)
  }

  function stop() {
    clearInterval(interval);
    setGameStarted(false);
  }

  function evolve() {
    gameOfLife.evolve();
    setGameState(gameOfLife.getState());
    setGeneration((g) => g + 1)
  }

  function random() {
    setGeneration(0);
    setGameState(generateRandomState(gridSize))
  }

  return (
    <div id="canvas-container">
      <div className="action-panel">
        <div><button disabled={gameStarted} onClick={evolve}>Evolve</button></div>
        <div><button onClick={gameStarted ? stop : start}>{!gameStarted ? 'Start' : 'Stop'}</button></div>
        <div><button disabled={gameStarted} onClick={random}>Random</button></div>
        <div><button disabled={gameStarted} onClick={() => {setGeneration(0); setGameState(generateEmptyState(gridSize))}}>Clear</button></div>
        <div><button disabled={gameStarted} onClick={() => setPatternModalOpen(true)}>Patterns</button></div>
        <div><button onClick={() => setRulesModalOpen(true)}>Rules</button></div>
        <div><button onClick={() => setThemeModalOpen(true)}>Themes</button></div>
        <div><button onClick={() => setSound(!sound)}>Sound: {sound ? 'On' : 'Off'}</button></div>
      </div>
      <div className="side-panel">
        <div>Generation: {generation}</div>
        <div><button onClick={() => setShowGrid(!showGrid)}>{ showGrid ? 'Hide Grid' : 'Show Grid' }</button></div>
        <label htmlFor="gridSize">Grid Size:</label>
        <input disabled={gameStarted} onChange={handleGridSizeChange} min="3" value={gridSize} max="500" type="range" id="#gridSize"/>
        <label  htmlFor="speed">Speed:</label>
        <input disabled={gameStarted} onChange={handleSpeedChange} min="1" value={speed} max="10" type="range" id="#speed"/>
      </div>
      {theme === 'Space' && sound && <audio loop autoPlay src="/assets/spacesound-7547.mp3"></audio>}
      {theme === 'Football' && sound && <audio loop autoPlay src="/assets/soccer-stadium-10-6709.mp3"></audio>}

      <Modal
        style={customStyles}
        isOpen={patternModalOpen}
        onRequestClose={() => setPatternModalOpen(false)}
        contentLabel="Patterns"
      >
        {Object.keys(patterns).map(name => (
          <div style={{ cursor: 'pointer' }} onClick={() => {
            setGeneration(0);
            setGameState(generatePreloadedState(gridSize, patterns[name]));
            setPatternModalOpen(false);
          }}>
            {name}
          </div>))}
      </Modal>
      <Modal
        style={customStyles}
        isOpen={rulesModalOpen}
        onRequestClose={() => setRulesModalOpen(false)}
        contentLabel="Rules"
      >

        <div style={{ fontWeight: '700', fontSize: '1.25rem', textAlign: 'center' }}>Rules</div>
        <ul style={{ fontStyle: 'italic', margin: '10px', padding: '10px' }}>
          <li>Each alive cell with one or no neighbors dies, as if by solitude.</li>
          <li>Each alive cell with four or more neighbors dies, as if by overpopulation.</li>
          <li>Each alive cell with two or three neighbors survives.</li>
          <li>Each died with three neighbors becomes populated.</li>
        </ul>
        <div style={{ fontWeight: '700', fontSize: '1.25rem', textAlign: 'center', marginTop: '2rem' }}>Tips</div>
        <ul style={{ fontStyle: 'italic', margin: '10px', padding: '10px' }}>
          <li>You can rotate view with your mouse.</li>
          <li>You can select/deselect cells with you mouse when game is stopped.</li>
          <li>You can select predefined pattern with Pattern button.</li>
          <li>You can fill up the board randomly with Random button.</li>
          <li>You can change the theme with Theme button.</li>
          <li>You can start/stop the game with start/stop button.</li>
        </ul>
      </Modal>
      <Modal
        style={customStyles}
        isOpen={themeModalOpen}
        onRequestClose={() => setThemeModalOpen(false)}
        contentLabel="Themes"
      >

        <div className='themes'>
          <div onClick={() => { setTheme('Basic'); setThemeModalOpen(false) }} className={classNames({ 'selected': theme === 'Basic' })}>Basic</div>
          <div onClick={() => { setTheme('Space'); setThemeModalOpen(false) }} className={classNames({ 'selected': theme === 'Space' })}>Space</div>
          <div onClick={() => { setTheme('Football'); setThemeModalOpen(false) }} className={classNames({ 'selected': theme === 'Football' })}>Football</div>
        </div>
      </Modal>
      <Canvas camera={{ position: [0, gridSize, gridSize], fov: 75 }}>
        <Title theme={theme} gridSize={gridSize} />
        <Suspense fallback={null}>
          {theme === 'Basic' && <BasicScene />}
          {theme === 'Space' && <SkyBox />}
          {theme === 'Football' && <FootbalScene />}

        </Suspense>
        <ThreeContent showGrid={showGrid} toggleCell={toggleCell} gameStarted={gameStarted} gridSize={gridSize} gameState={gameState} />
      </Canvas>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))