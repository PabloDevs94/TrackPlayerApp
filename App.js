import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import TrackPlayer, { useProgress, Event } from 'react-native-track-player';
import { Play, Pause, SkipForward, SkipBack, FastForward, Rewind, List, Clock } from 'phosphor-react-native'; // Adicionando Clock para controle de velocidade
import Slider from '@react-native-community/slider';

// Lista de tracks
const tracks = [
  {
    id: '1',
    url: 'https://trustyy-public.s3.us-east-1.amazonaws.com/shareable/670013517e69ca0fad1632b1/Chapter%2000%20Opening%20Credits.mp3',
    title: 'Opening Credits',
    artist: 'DR. TIM THAYNE',
  },
  {
    id: '2',
    url: 'https://trustyy-public.s3.us-east-1.amazonaws.com/shareable/670013517e69ca0fad1632b1/Chapter%2001%20Introduction.mp3',
    title: 'Introduction',
    artist: 'DR. TIM THAYNE',
  },
  {
    id: '3',
    url: 'https://trustyy-public.s3.us-east-1.amazonaws.com/shareable/670013517e69ca0fad1632b1/Chapter%201.mp3',
    title: 'Chapter 1 - All or Nothing What It Takes to Succeed',
    artist: 'DR. TIM THAYNE',
  },
  {
    id: '4',
    url: 'https://trustyy-public.s3.us-east-1.amazonaws.com/shareable/670013517e69ca0fad1632b1/Chapter%202.mp3',
    title: 'Chapter 2 - Know When to Hold `Em: How Good Treatment Programs Work',
    artist: 'DR. TIM THAYNE',
  },
];

const App = () => {
  const [trackTitle, setTrackTitle] = useState(tracks[0].title);
  const [artistName, setArtistName] = useState(tracks[0].artist);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const { position, duration } = useProgress();
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [showQueue, setShowQueue] = useState(false); // Controle da queue de faixas

  // Função de setup inicial do player
  useEffect(() => {
    setupPlayer();
    const trackChangeListener = TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async (data) => {
      if (data.nextTrack !== null) {
        const track = await TrackPlayer.getTrack(data.nextTrack);
        setTrackTitle(track.title);
        setArtistName(track.artist);
      }
    });
    return () => {
      trackChangeListener.remove();
    };
  }, []);

  const setupPlayer = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.add(tracks);
    setTrackTitle(tracks[0].title);
    setArtistName(tracks[0].artist);
  };

  // Funções de controle de reprodução
  const playTrack = async () => {
    await TrackPlayer.play();
    setIsPlaying(true);
  };

  const pauseTrack = async () => {
    await TrackPlayer.pause();
    setIsPlaying(false);
  };

  const skipToNext = async () => {
    await TrackPlayer.skipToNext();
  };

  const skipToPrevious = async () => {
    await TrackPlayer.skipToPrevious();
  };

  const skipForward10Seconds = async () => {
    const currentPosition = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(currentPosition + 10);
  };

  const skipBackward10Seconds = async () => {
    const currentPosition = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(Math.max(0, currentPosition - 10));
  };

  const handleSliderChange = async (value) => {
    await TrackPlayer.seekTo(value);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const changePlaybackSpeed = async (speed) => {
    setPlaybackSpeed(speed);
    await TrackPlayer.setRate(speed);
  };
  

  // Funções de toggle
  const toggleSpeedOptions = () => setShowSpeedOptions(!showSpeedOptions);
  const toggleQueue = () => setShowQueue(!showQueue); // Função para exibir/esconder a queue

  return (
    <View style={styles.container}>
      {/* Ícone de Queue no canto superior esquerdo */}
      <TouchableOpacity onPress={toggleQueue} style={styles.queueButton}>
        <Text>
        <List size={24} color="#FFF" /> {/* Ícone personalizado para Queue */}
        </Text>
      </TouchableOpacity>

      {/* Ícone para controle de velocidade no canto superior direito */}
      <TouchableOpacity onPress={toggleSpeedOptions} style={styles.speedButton}>
        <Text>
        <Clock size={24} color="#FFF" /> {/* Ícone personalizado para Velocidade */}
        </Text>
      </TouchableOpacity>

      {/* Capa do Audiobook */}
      <Image
        source={require('./Assets/Screenshot_Not_By_Chance2.png')}
        style={styles.albumCover}
        resizeMode="contain"
      />

      {/* Informações da Música */}
      <View style={styles.infoContainer}>
        <Text style={styles.songTitle}>{trackTitle}</Text>
        <Text style={styles.artistName}>{artistName}</Text>
      </View>

      {/* Barra de Progresso */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onValueChange={handleSliderChange}
          minimumTrackTintColor="#55A8B2"
          maximumTrackTintColor="#E5E7EB"
          thumbTintColor="#FFF"
        />
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      {/* Controles de Reprodução */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={skipToPrevious} style={styles.controlButton}>
          <SkipBack size={20} color="#4B5563" weight="fill" />
        </TouchableOpacity>
        <TouchableOpacity onPress={skipBackward10Seconds} style={styles.controlButton}>
          <Rewind size={24} color="#4B5563" weight="fill" />
        </TouchableOpacity>
        {isPlaying ? (
          <TouchableOpacity onPress={pauseTrack} style={styles.playPauseButtonContainer}>
            <Pause size={32} color="#FFF" weight="fill" style={styles.playPauseIcon} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={playTrack} style={styles.playPauseButtonContainer}>
            <Play size={32} color="#FFF" weight="fill" style={styles.playPauseIcon} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={skipForward10Seconds} style={styles.controlButton}>
          <FastForward size={24} color="#4B5563" weight="fill" />
        </TouchableOpacity>
        <TouchableOpacity onPress={skipToNext} style={styles.controlButton}>
          <SkipForward size={20} color="#4B5563" weight="fill" />
        </TouchableOpacity>
      </View>

      {/* Caixa de opções de velocidade */}
{showSpeedOptions && (
  <View style={styles.speedOptionsBox}>
    {[0.5, 1, 1.5, 2].map((speed) => (
      <TouchableOpacity key={speed} onPress={() => changePlaybackSpeed(speed)}>
        <Text style={playbackSpeed === speed ? styles.selectedSpeed : styles.speedText}>
          {speed}x
        </Text>
      </TouchableOpacity>
    ))}
  </View>
)}

      {/* Queue de faixas */}
      {showQueue && (
        <View style={styles.queueContainer}>
          <FlatList
            data={tracks}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => TrackPlayer.skip(index)}>
                <Text style={styles.queueTrackTitle}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

// Estilos refatorados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  albumCover: {
    width: '375%',
    height: 500,
    flexShrink: 0,
    alignSelf: 'center',
    marginBottom: 10,
    resizeMode: 'contain',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  songTitle: {
    alignSelf: 'stretch',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1F2937',
    textAlign: 'left',
    paddingLeft: 16,
  },
  artistName: {
    alignSelf: 'stretch',
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'left',
    paddingLeft: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 20,
  },
  slider: {
    width: '80%',
    borderRadius: 16,
    height: 16,
    bottom: 40,
  },
  timeText: {
    color: '#000',
    fontSize: 12,
    bottom: 40,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 1,
    width: '80%',
    marginVertical: 20,
  },
  controlButton: {
    padding: 10,
  },
  playPauseButtonContainer: {
    display: 'flex',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 64,
    backgroundColor: '#55A8B2',
  },
  playPauseIcon: {
    width: 32,
    height: 32,
  },
  playbackSpeedButton: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 10,
  },
  speedOptionsBox: {
    marginTop: 10,
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  speedText: {
    fontSize: 16,
    color: '#55A8B2',
    marginBottom: 10,
  },
  selectedSpeed: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
  },
  queueButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 4,
    borderRadius: 15,
  },
  speedButton: {
    position: 'absolute',
    top: 40,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 4,
    borderRadius: 15,
  },
  queueContainer: {
    position: 'absolute',
    bottom: 150,
    left: 20,
    right: 20,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 5,
  },
  queueTrackTitle: {
    fontSize: 16,
    color: '#1F2937',
    padding: 10,
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
  },
});

export default App;
