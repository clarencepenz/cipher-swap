import React, { useState, useEffect, useCallback } from 'react'
import { SlideFade, Container, useDisclosure } from '@chakra-ui/react'
import styled from 'styled-components'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Text, Flex, CardBody, CardFooter, Heading } from '@clarencepenz/uikit'
import { AppHeader, AppBody } from '../components/App'

// import Header from "./components/Header";
import Title from './components/Title'
// import TopBar from "./components/TopBar";
import PoolList from './components/PoolList'

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`

function Staking() {
  const { isOpen, onToggle } = useDisclosure()
  const { account } = useActiveWeb3React()

  useEffect(() => {
    setTimeout(() => {
      onToggle()
    }, 150)
    // eslint-disable-next-line
  }, [])

  const [totalStaked, setTotalStaked] = useState({ token: 0, usd: 0 })

  const updateTotalStaked = useCallback((amount, amountInUsd) => {
    setTotalStaked({ token: amount, usd: amountInUsd })
  }, [])

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <Container maxW="container.xl" minH="100vh">
      {/* <SlideFade direction="left" offsetY="-40px" in={isOpen}>
				<Header
					totalStaked={totalStaked.token}
					totalStakedInUsd={totalStaked.usd}
				/>
			</SlideFade> */}
      {account && (
        <ModalCOntainer>
          <AppBody>
            <AppHeader title="Your Stake" subtitle="Stake your $YARL tokens here" noConfig/>
            <Body>
              {account && (
                <Flex flexDirection="column" alignItems="center" mt="24px">
                  <Text color="textSubtle" mb="8px">
				  {parseFloat(totalStaked.token).toLocaleString()} YARL
                  </Text>
				  <Text color="textSubtle" mb="8px">
				  {totalStaked.usd}{" "}YARL
                  </Text>
                  {/* <Button id="import-pool-link" variant="secondary" scale="sm" to="/find">
                   Your Staked balancekens
                  </Button> */}
                </Flex>
              )}
            </Body>
            <CardFooter style={{ textAlign: 'center' }}>
              {/* <Button id="join-pool-button" to="/add" width="100%" startIcon={<AddIcon color="white" />}>
                Add Stake
              </Button> */}
            </CardFooter>
          </AppBody>
        </ModalCOntainer>
      )}
      <SlideFade direction="left" offsetY="40px" in={isOpen}>
        <Title>Available Pools</Title>
        {!account && (
			<StyledNotFound>
			{/* <LogoIcon width="64px" mb="8px" /> */}
			<Heading scale="xxl">401</Heading>
			<Text mb="16px">Oops, not connected.</Text>
			{/* <Button as={Link} to="/" scale="sm">
			  {t('Back Home')}
			</Button> */}
		  </StyledNotFound>
			)}
        {account && (<PoolList onUpdateTotalStaked={updateTotalStaked} />)}
      </SlideFade>
    </Container>
  )
}

export default Staking

const ModalCOntainer = styled(CardBody)`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 0;
`
const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-top: 12rem;
  justify-content: center;
`